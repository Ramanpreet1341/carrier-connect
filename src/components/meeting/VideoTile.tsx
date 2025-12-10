import React, { useEffect, useRef } from 'react';
import { Participant } from '@/types/meeting';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mic, MicOff, Video, VideoOff, Monitor } from 'lucide-react';
import { getInitials } from '@/lib/meetingUtils';
import { cn } from '@/lib/utils';

interface VideoTileProps {
  participant: Participant;
  stream?: MediaStream | null;
  isLocal?: boolean;
  isSpeaking?: boolean;
  className?: string;
}

export const VideoTile: React.FC<VideoTileProps> = ({
  participant,
  stream,
  isLocal = false,
  isSpeaking = false,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (audioRef.current && stream && !isLocal) {
      audioRef.current.srcObject = stream;
    }
  }, [stream, isLocal]);

  const isVideoEnabled = participant.isVideoEnabled !== false;
  const isAudioEnabled = participant.isAudioEnabled !== false;

  return (
    <div
      className={cn(
        'relative bg-gray-900 rounded-lg overflow-hidden aspect-video',
        isSpeaking && 'ring-2 ring-purple-500 ring-offset-2',
        className
      )}
    >
      {/* Video element */}
      {isVideoEnabled && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="bg-purple-500 text-white text-2xl font-bold">
              {getInitials(participant.userName)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Audio element for remote participants */}
      {!isLocal && (
        <audio ref={audioRef} autoPlay playsInline />
      )}

      {/* Participant info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium truncate">
              {participant.userName}
              {isLocal && ' (You)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {participant.isScreenSharing && (
              <Monitor className="h-4 w-4 text-white" />
            )}
            {isAudioEnabled ? (
              <Mic className="h-4 w-4 text-white" />
            ) : (
              <MicOff className="h-4 w-4 text-red-500" />
            )}
            {isVideoEnabled ? (
              <Video className="h-4 w-4 text-white" />
            ) : (
              <VideoOff className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="absolute top-2 right-2">
          <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};

