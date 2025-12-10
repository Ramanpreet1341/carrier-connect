import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MessageSquare,
  Users,
  PhoneOff,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ControlsBarProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onLeave: () => void;
  showChat?: boolean;
  showParticipants?: boolean;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onToggleParticipants,
  onLeave,
  showChat = false,
  showParticipants = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        {/* Audio Toggle */}
        <Button
          variant="ghost"
          size="lg"
          onClick={onToggleAudio}
          className={cn(
            'rounded-full h-12 w-12 p-0',
            !isAudioEnabled && 'bg-red-600 hover:bg-red-700 text-white'
          )}
        >
          {isAudioEnabled ? (
            <Mic className="h-5 w-5" />
          ) : (
            <MicOff className="h-5 w-5" />
          )}
        </Button>

        {/* Video Toggle */}
        <Button
          variant="ghost"
          size="lg"
          onClick={onToggleVideo}
          className={cn(
            'rounded-full h-12 w-12 p-0',
            !isVideoEnabled && 'bg-red-600 hover:bg-red-700 text-white'
          )}
        >
          {isVideoEnabled ? (
            <Video className="h-5 w-5" />
          ) : (
            <VideoOff className="h-5 w-5" />
          )}
        </Button>

        {/* Screen Share */}
        <Button
          variant="ghost"
          size="lg"
          onClick={onToggleScreenShare}
          className={cn(
            'rounded-full h-12 w-12 p-0',
            isScreenSharing && 'bg-purple-600 hover:bg-purple-700 text-white'
          )}
        >
          <Monitor className="h-5 w-5" />
        </Button>

        {/* Chat Toggle */}
        <Button
          variant="ghost"
          size="lg"
          onClick={onToggleChat}
          className={cn(
            'rounded-full h-12 w-12 p-0',
            showChat && 'bg-purple-600 hover:bg-purple-700 text-white'
          )}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>

        {/* Participants Toggle */}
        <Button
          variant="ghost"
          size="lg"
          onClick={onToggleParticipants}
          className={cn(
            'rounded-full h-12 w-12 p-0',
            showParticipants && 'bg-purple-600 hover:bg-purple-700 text-white'
          )}
        >
          <Users className="h-5 w-5" />
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full h-12 w-12 p-0"
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* Leave Meeting */}
        <Button
          variant="destructive"
          size="lg"
          onClick={onLeave}
          className="rounded-full h-12 px-6"
        >
          <PhoneOff className="h-5 w-5 mr-2" />
          Leave
        </Button>
      </div>
    </div>
  );
};

