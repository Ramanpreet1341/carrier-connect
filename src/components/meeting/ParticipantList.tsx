import React from 'react';
import { Participant } from '@/types/meeting';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Crown } from 'lucide-react';
import { getInitials } from '@/lib/meetingUtils';

interface ParticipantListProps {
  participants: Participant[];
  hostId: string | null;
  currentUserId: string;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  hostId,
  currentUserId,
}) => {
  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Participants ({participants.length})
        </h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {participants.map((participant) => {
            const isHost = participant.id === hostId;
            const isCurrentUser = participant.id === currentUserId;
            const isVideoEnabled = participant.isVideoEnabled !== false;
            const isAudioEnabled = participant.isAudioEnabled !== false;

            return (
              <div
                key={participant.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    {getInitials(participant.userName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {participant.userName}
                      {isCurrentUser && ' (You)'}
                    </span>
                    {isHost && (
                      <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {isAudioEnabled ? (
                      <Mic className="h-3 w-3 text-gray-500" />
                    ) : (
                      <MicOff className="h-3 w-3 text-red-500" />
                    )}
                    {isVideoEnabled ? (
                      <Video className="h-3 w-3 text-gray-500" />
                    ) : (
                      <VideoOff className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>

                {isHost && (
                  <Badge variant="outline" className="text-xs">
                    Host
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

