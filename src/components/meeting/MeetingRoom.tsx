import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useMeetingSocket } from '@/hooks/useMeetingSocket';
import { VideoTile } from './VideoTile';
import { ControlsBar } from './ControlsBar';
import { ChatPanel } from './ChatPanel';
import { ParticipantList } from './ParticipantList';
import { Participant, ChatMessage } from '@/types/meeting';
import { getUserName, getUserId, getGridLayoutClass } from '@/lib/meetingUtils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const MeetingRoom: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meetingDuration, setMeetingDuration] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());
  const userName = getUserName();
  const userId = getUserId();

  // Initialize WebRTC
  const {
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
    cleanup: cleanupWebRTC,
  } = useWebRTC({
    localVideoRef,
    onRemoteStream: (stream, userId) => {
      remoteStreamsRef.current.set(userId, stream);
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === userId ? { ...p, isVideoEnabled: true } : p
        )
      );
    },
  });

  // Initialize Socket
  const {
    isConnected,
    participants: socketParticipants,
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
  } = useMeetingSocket({
    meetingId: meetingId || '',
    userName,
    userId,
    onParticipantJoined: async (participant) => {
      if (participant.id !== userId && localStream) {
        // Create offer for new participant
        try {
          const offer = await createOffer(participant.id);
          sendOffer(participant.id, offer);
        } catch (error) {
          console.error('Error creating offer:', error);
        }
      }
    },
    onParticipantLeft: (participant) => {
      removePeerConnection(participant.id);
      remoteStreamsRef.current.delete(participant.id);
    },
    onChatMessage: (message) => {
      setChatMessages((prev) => [...prev, message]);
    },
    onError: (errorMessage) => {
      setError(errorMessage);
      toast({
        title: 'Connection Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Update participants from socket
  useEffect(() => {
    setParticipants(socketParticipants);
  }, [socketParticipants]);

  // Initialize local stream
  useEffect(() => {
    const init = async () => {
      try {
        await initializeLocalStream(true, true);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing stream:', error);
        setError('Failed to access camera/microphone. Please check permissions.');
        toast({
          title: 'Permission Error',
          description: 'Please allow camera and microphone access.',
          variant: 'destructive',
        });
      }
    };

    if (!isInitialized) {
      init();
    }
  }, [initializeLocalStream, isInitialized, toast]);

  // Handle WebRTC signaling
  useEffect(() => {
    if (!isConnected) return;

    const handleOffer = async (data: {
      offer: RTCSessionDescriptionInit;
      fromUserId: string;
    }) => {
      if (data.fromUserId === userId) return;

      try {
        addPeerConnection(data.fromUserId);
        const answer = await createAnswer(data.fromUserId, data.offer);
        sendAnswer(data.fromUserId, answer);
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    };

    const handleAnswer = async (data: {
      answer: RTCSessionDescriptionInit;
      fromUserId: string;
    }) => {
      if (data.fromUserId === userId) return;
      try {
        await setRemoteDescription(data.fromUserId, data.answer);
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    };

    const handleIceCandidate = async (data: {
      candidate: RTCIceCandidateInit;
      fromUserId: string;
    }) => {
      if (data.fromUserId === userId) return;
      try {
        await addIceCandidate(data.fromUserId, data.candidate);
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    };

    const cleanupOffer = onOffer(handleOffer);
    const cleanupAnswer = onAnswer(handleAnswer);
    const cleanupIce = onIceCandidate(handleIceCandidate);

    return () => {
      cleanupOffer?.();
      cleanupAnswer?.();
      cleanupIce?.();
    };
  }, [
    isConnected,
    userId,
    addPeerConnection,
    createAnswer,
    createOffer,
    sendAnswer,
    setRemoteDescription,
    addIceCandidate,
    onOffer,
    onAnswer,
    onIceCandidate,
  ]);

  // Create offers for existing participants
  useEffect(() => {
    if (isInitialized && localStream && participants.length > 0) {
      participants.forEach(async (participant) => {
        if (participant.id !== userId && !remoteStreamsRef.current.has(participant.id)) {
          try {
            const offer = await createOffer(participant.id);
            sendOffer(participant.id, offer);
          } catch (error) {
            console.error('Error creating offer for participant:', error);
          }
        }
      });
    }
  }, [isInitialized, localStream, participants, userId, createOffer, sendOffer]);

  // Meeting duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setMeetingDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle screen share
  const handleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      await stopScreenShare();
      notifyScreenShareStop();
    } else {
      await startScreenShare();
      notifyScreenShareStart();
    }
  }, [isScreenSharing, startScreenShare, stopScreenShare, notifyScreenShareStart, notifyScreenShareStop]);

  // Handle leave meeting
  const handleLeave = useCallback(() => {
    cleanupWebRTC();
    leaveMeeting();
    navigate('/user-dashboard');
  }, [cleanupWebRTC, leaveMeeting, navigate]);

  // Format duration
  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!meetingId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Invalid meeting ID</AlertDescription>
        </Alert>
      </div>
    );
  }

  const allParticipants = [
    {
      id: userId,
      socketId: '',
      userName,
      joinedAt: new Date().toISOString(),
      isVideoEnabled,
      isAudioEnabled,
      isScreenSharing,
    },
    ...participants.filter((p) => p.id !== userId),
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Meeting: {meetingId}</h1>
          <div className="flex items-center gap-2 text-sm">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>
        <div className="text-sm">
          Duration: {formatDuration(meetingDuration)}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden pb-20">
        {/* Video Grid */}
        <div className={`flex-1 p-4 grid ${getGridLayoutClass(allParticipants.length)} gap-4`}>
          {/* Local Video */}
          <VideoTile
            participant={allParticipants[0]}
            stream={localStream}
            isLocal
            className="w-full"
          />

          {/* Remote Videos */}
          {allParticipants.slice(1).map((participant) => (
            <VideoTile
              key={participant.id}
              participant={participant}
              stream={remoteStreamsRef.current.get(participant.id)}
              className="w-full"
            />
          ))}
        </div>

        {/* Side Panels */}
        {showChat && (
          <div className="w-80 border-l border-gray-200">
            <ChatPanel
              messages={chatMessages}
              onSendMessage={sendChatMessage}
              userName={userName}
            />
          </div>
        )}

        {showParticipants && (
          <div className="w-80 border-l border-gray-200">
            <ParticipantList
              participants={allParticipants}
              hostId={hostId}
              currentUserId={userId}
            />
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <ControlsBar
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        isScreenSharing={isScreenSharing}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={handleScreenShare}
        onToggleChat={() => setShowChat(!showChat)}
        onToggleParticipants={() => setShowParticipants(!showParticipants)}
        onLeave={handleLeave}
        showChat={showChat}
        showParticipants={showParticipants}
      />
    </div>
  );
};

