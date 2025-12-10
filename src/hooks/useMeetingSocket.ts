import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Participant, ChatMessage, SignalingEvents } from '@/types/meeting';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

interface UseMeetingSocketOptions {
  meetingId: string;
  userName: string;
  userId: string;
  onParticipantJoined?: (participant: Participant) => void;
  onParticipantLeft?: (participant: Participant) => void;
  onChatMessage?: (message: ChatMessage) => void;
  onError?: (error: string) => void;
}

export const useMeetingSocket = (options: UseMeetingSocketOptions) => {
  const { meetingId, userName, userId, onParticipantJoined, onParticipantLeft, onChatMessage, onError } = options;
  
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [hostId, setHostId] = useState<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
      
      // Join meeting
      socket.emit('join-meeting', { meetingId, userName, userId });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      if (onError) {
        onError('Failed to connect to meeting server');
      }
    });

    socket.on('meeting-joined', (data) => {
      console.log('Meeting joined:', data);
      setParticipants(data.participants);
      setHostId(data.hostId);
    });

    socket.on('user-joined', (data) => {
      console.log('User joined:', data.participant);
      setParticipants(data.participants);
      if (onParticipantJoined) {
        onParticipantJoined(data.participant);
      }
    });

    socket.on('user-left', (data) => {
      console.log('User left:', data.participant);
      setParticipants(data.participants);
      setHostId(data.newHostId);
      if (onParticipantLeft) {
        onParticipantLeft(data.participant);
      }
    });

    socket.on('chat-message', (message) => {
      if (onChatMessage) {
        onChatMessage(message);
      }
    });

    socket.on('error', (data) => {
      console.error('Socket error:', data.message);
      if (onError) {
        onError(data.message);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [meetingId, userName, userId, onParticipantJoined, onParticipantLeft, onChatMessage, onError]);

  // Send offer
  const sendOffer = useCallback((targetUserId: string, offer: RTCSessionDescriptionInit) => {
    if (socketRef.current) {
      socketRef.current.emit('offer', {
        meetingId,
        offer,
        targetUserId,
      });
    }
  }, [meetingId]);

  // Send answer
  const sendAnswer = useCallback((targetUserId: string, answer: RTCSessionDescriptionInit) => {
    if (socketRef.current) {
      socketRef.current.emit('answer', {
        meetingId,
        answer,
        targetUserId,
      });
    }
  }, [meetingId]);

  // Send ICE candidate
  const sendIceCandidate = useCallback((targetUserId: string, candidate: RTCIceCandidateInit) => {
    if (socketRef.current) {
      socketRef.current.emit('ice-candidate', {
        meetingId,
        candidate,
        targetUserId,
      });
    }
  }, [meetingId]);

  // Send chat message
  const sendChatMessage = useCallback((message: string) => {
    if (socketRef.current) {
      socketRef.current.emit('chat-message', {
        meetingId,
        message,
        userName,
        userId,
      });
    }
  }, [meetingId, userName, userId]);

  // Start screen share notification
  const notifyScreenShareStart = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('screen-share-start', { meetingId });
    }
  }, [meetingId]);

  // Stop screen share notification
  const notifyScreenShareStop = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('screen-share-stop', { meetingId });
    }
  }, [meetingId]);

  // Listen for offer
  const onOffer = useCallback((callback: (data: { offer: RTCSessionDescriptionInit; fromUserId: string }) => void) => {
    if (socketRef.current) {
      socketRef.current.on('offer', callback);
      return () => {
        socketRef.current?.off('offer', callback);
      };
    }
  }, []);

  // Listen for answer
  const onAnswer = useCallback((callback: (data: { answer: RTCSessionDescriptionInit; fromUserId: string }) => void) => {
    if (socketRef.current) {
      socketRef.current.on('answer', callback);
      return () => {
        socketRef.current?.off('answer', callback);
      };
    }
  }, []);

  // Listen for ICE candidate
  const onIceCandidate = useCallback((callback: (data: { candidate: RTCIceCandidateInit; fromUserId: string }) => void) => {
    if (socketRef.current) {
      socketRef.current.on('ice-candidate', callback);
      return () => {
        socketRef.current?.off('ice-candidate', callback);
      };
    }
  }, []);

  // Leave meeting
  const leaveMeeting = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    participants,
    hostId,
    sendOffer,
    sendAnswer,
    sendIceCandidate,
    sendChatMessage,
    notifyScreenShareStart,
    notifyScreenShareStop,
    onOffer,
    onAnswer,
    onIceCandidate,
    leaveMeeting,
  };
};

