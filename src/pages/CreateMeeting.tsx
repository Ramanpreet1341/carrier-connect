import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Video, Copy, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserName, copyMeetingLink } from '@/lib/meetingUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const CreateMeeting: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const userName = getUserName();

  const handleCreateMeeting = async () => {
    setIsCreating(true);
    try {
      const response = await fetch(`${API_URL}/api/meetings/create`);
      const data = await response.json();

      if (response.ok) {
        setMeetingId(data.meetingId);
        toast({
          title: 'Meeting Created',
          description: 'Your meeting has been created successfully!',
        });
      } else {
        throw new Error(data.error || 'Failed to create meeting');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast({
        title: 'Error',
        description: 'Failed to create meeting. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinMeeting = () => {
    if (meetingId) {
      navigate(`/meet/${meetingId}`);
    }
  };

  const handleCopyLink = async () => {
    if (meetingId) {
      try {
        await copyMeetingLink(meetingId);
        setCopied(true);
        toast({
          title: 'Link Copied',
          description: 'Meeting link copied to clipboard!',
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to copy link.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Video className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">Create New Meeting</CardTitle>
          <CardDescription>
            Start a video conference and invite others to join
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!meetingId ? (
            <>
              <div className="space-y-2">
                <Label>Your Name</Label>
                <Input value={userName} disabled />
              </div>
              <Button
                onClick={handleCreateMeeting}
                disabled={isCreating}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Create Meeting
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Label className="text-sm text-gray-600">Meeting ID</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={meetingId}
                      readOnly
                      className="font-mono text-lg font-bold"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <Label className="text-sm text-gray-600">Meeting Link</Label>
                  <p className="text-sm text-gray-700 mt-2 break-all">
                    {window.location.origin}/meet/{meetingId}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="flex-1"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                <Button
                  onClick={handleJoinMeeting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Video className="mr-2 h-4 w-4" />
                  Join Now
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

