// Meeting types and interfaces

export interface Participant {
  id: string;
  socketId: string;
  userName: string;
  joinedAt: string;
  isAudioEnabled?: boolean;
  isVideoEnabled?: boolean;
  isScreenSharing?: boolean;
  isSpeaking?: boolean;
}

export interface Meeting {
  id: string;
  hostId: string | null;
  participants: Participant[];
  createdAt: string;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  message: string;
  userName: string;
  userId: string;
  timestamp: string;
}

export interface MeetingConfig {
  meetingId: string;
  userName: string;
  userId: string;
  isHost: boolean;
}

export interface WebRTCConnection {
  peerConnection: RTCPeerConnection;
  stream: MediaStream | null;
  remoteStream: MediaStream | null;
}

export interface SignalingEvents {
  'join-meeting': (data: { meetingId: string; userName: string; userId: string }) => void;
  'meeting-joined': (data: { meetingId: string; participants: Participant[]; hostId: string | null }) => void;
  'user-joined': (data: { participant: Participant; participants: Participant[] }) => void;
  'user-left': (data: { participant: Participant; participants: Participant[]; newHostId: string | null }) => void;
  'offer': (data: { offer: RTCSessionDescriptionInit; fromUserId: string; targetUserId: string }) => void;
  'answer': (data: { answer: RTCSessionDescriptionInit; fromUserId: string; targetUserId: string }) => void;
  'ice-candidate': (data: { candidate: RTCIceCandidateInit; fromUserId: string; targetUserId: string }) => void;
  'chat-message': (message: ChatMessage) => void;
  'screen-share-start': (data: { userId: string }) => void;
  'screen-share-stop': (data: { userId: string }) => void;
  'error': (data: { message: string }) => void;
}

