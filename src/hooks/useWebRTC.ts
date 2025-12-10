import { useState, useRef, useCallback, useEffect } from 'react';
import { Participant } from '@/types/meeting';

interface UseWebRTCOptions {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  onRemoteStream?: (stream: MediaStream, userId: string) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
}

interface PeerConnection {
  peerConnection: RTCPeerConnection;
  userId: string;
  stream?: MediaStream;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTC = (options: UseWebRTCOptions) => {
  const { localVideoRef, onRemoteStream, onConnectionStateChange } = options;
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const peerConnectionsRef = useRef<Map<string, PeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Initialize local media stream
  const initializeLocalStream = useCallback(async (video = true, audio = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: 1280, height: 720 } : false,
        audio: audio,
      });

      localStreamRef.current = stream;
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }, [localVideoRef]);

  // Create peer connection
  const createPeerConnection = useCallback((userId: string): RTCPeerConnection => {
    const peerConnection = new RTCPeerConnection(ICE_SERVERS);

    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        if (localStreamRef.current) {
          peerConnection.addTrack(track, localStreamRef.current);
        }
      });
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (onRemoteStream) {
        onRemoteStream(remoteStream, userId);
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      if (onConnectionStateChange) {
        onConnectionStateChange(peerConnection.connectionState);
      }
      
      if (peerConnection.connectionState === 'failed') {
        peerConnection.restartIce();
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // ICE candidate will be sent via socket
      }
    };

    return peerConnection;
  }, [onRemoteStream, onConnectionStateChange]);

  // Add peer connection
  const addPeerConnection = useCallback((userId: string): RTCPeerConnection => {
    const peerConnection = createPeerConnection(userId);
    peerConnectionsRef.current.set(userId, {
      peerConnection,
      userId,
    });
    return peerConnection;
  }, [createPeerConnection]);

  // Remove peer connection
  const removePeerConnection = useCallback((userId: string) => {
    const peer = peerConnectionsRef.current.get(userId);
    if (peer) {
      peer.peerConnection.close();
      peer.stream?.getTracks().forEach(track => track.stop());
      peerConnectionsRef.current.delete(userId);
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(async () => {
    if (!localStreamRef.current) return;

    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      const newState = !videoTrack.enabled;
      videoTrack.enabled = newState;
      setIsVideoEnabled(newState);
    }
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(async () => {
    if (!localStreamRef.current) return;

    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      const newState = !audioTrack.enabled;
      audioTrack.enabled = newState;
      setIsAudioEnabled(newState);
    }
  }, []);

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      screenStreamRef.current = screenStream;

      // Replace video track in all peer connections
      const videoTrack = screenStream.getVideoTracks()[0];
      peerConnectionsRef.current.forEach((peer) => {
        const sender = peer.peerConnection.getSenders().find(
          (s) => s.track?.kind === 'video'
        );
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      });

      // Update local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      setIsScreenSharing(true);

      // Stop screen share when user stops sharing
      videoTrack.onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  }, [localVideoRef]);

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    // Restore camera track
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        peerConnectionsRef.current.forEach((peer) => {
          const sender = peer.peerConnection.getSenders().find(
            (s) => s.track?.kind === 'video'
          );
          if (sender && videoTrack) {
            sender.replaceTrack(videoTrack);
          }
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
      }
    }

    setIsScreenSharing(false);
  }, []);

  // Create offer
  const createOffer = useCallback(async (userId: string): Promise<RTCSessionDescriptionInit> => {
    let peerConnection = peerConnectionsRef.current.get(userId)?.peerConnection;
    
    if (!peerConnection) {
      peerConnection = addPeerConnection(userId);
    }

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
  }, [addPeerConnection]);

  // Create answer
  const createAnswer = useCallback(async (
    userId: string,
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit> => {
    let peerConnection = peerConnectionsRef.current.get(userId)?.peerConnection;
    
    if (!peerConnection) {
      peerConnection = addPeerConnection(userId);
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
  }, [addPeerConnection]);

  // Set remote description
  const setRemoteDescription = useCallback(async (
    userId: string,
    description: RTCSessionDescriptionInit
  ) => {
    const peer = peerConnectionsRef.current.get(userId);
    if (peer) {
      await peer.peerConnection.setRemoteDescription(new RTCSessionDescription(description));
    }
  }, []);

  // Add ICE candidate
  const addIceCandidate = useCallback(async (
    userId: string,
    candidate: RTCIceCandidateInit
  ) => {
    const peer = peerConnectionsRef.current.get(userId);
    if (peer) {
      try {
        await peer.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  }, []);

  // Cleanup
  const cleanup = useCallback(() => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Close all peer connections
    peerConnectionsRef.current.forEach((peer) => {
      peer.peerConnection.close();
    });
    peerConnectionsRef.current.clear();

    setLocalStream(null);
    setIsVideoEnabled(false);
    setIsAudioEnabled(false);
    setIsScreenSharing(false);
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    localStream,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    initializeLocalStream,
    addPeerConnection,
    removePeerConnection,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
    createOffer,
    createAnswer,
    setRemoteDescription,
    addIceCandidate,
    cleanup,
  };
};

