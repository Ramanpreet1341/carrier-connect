import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Video, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getUserName, isValidMeetingId } from '@/lib/meetingUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const JoinMeeting: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [meetingId, setMeetingId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userName = getUserName();

  const handleJoinMeeting = async () => {
    setError(null);

    if (!meetingId.trim()) {
      setError('Please enter a meeting ID');
      return;
    }

    if (!isValidMeetingId(meetingId)) {
      setError('Invalid meeting ID format');
      return;
    }

    setIsJoining(true);

    try {
      const response = await fetch(
        `${API_URL}/api/meetings/${meetingId.toUpperCase()}/validate`
      );
      const data = await response.json();

      if (response.ok && data.valid) {
        navigate(`/meet/${meetingId.toUpperCase()}`);
      } else {
        throw new Error(data.error || 'Meeting not found or inactive');
      }
    } catch (error) {
      console.error('Error joining meeting:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to join meeting. Please check the meeting ID.'
      );
      toast({
        title: 'Error',
        description: 'Failed to join meeting. Please check the meeting ID.',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinMeeting();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Video className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">Join Meeting</CardTitle>
          <CardDescription>
            Enter the meeting ID to join a video conference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Your Name</Label>
            <Input value={userName} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingId">Meeting ID</Label>
            <Input
              id="meetingId"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              placeholder="Enter meeting ID"
              className="font-mono text-lg font-bold"
              maxLength={10}
            />
            <p className="text-xs text-gray-500">
              Enter the meeting ID provided by the host
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleJoinMeeting}
            disabled={isJoining || !meetingId.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            {isJoining ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Video className="mr-2 h-4 w-4" />
                Join Meeting
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

