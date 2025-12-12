import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const httpServer = createServer(app);

// Configure CORS for Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Store active meetings
const meetings = new Map();

// Generate unique meeting ID
const generateMeetingId = () => {
  return uuidv4().split('-')[0].toUpperCase();
};

// API Routes
app.get('/api/meetings/create', (req, res) => {
  const meetingId = generateMeetingId();
  const meeting = {
    id: meetingId,
    hostId: null,
    participants: [],
    createdAt: new Date().toISOString(),
    isActive: true
  };
  meetings.set(meetingId, meeting);
  res.json({ meetingId, meeting });
});

app.get('/api/meetings/:meetingId', (req, res) => {
  const { meetingId } = req.params;
  const meeting = meetings.get(meetingId.toUpperCase());
  
  if (!meeting) {
    return res.status(404).json({ error: 'Meeting not found' });
  }
  
  res.json({ meeting });
});

app.post('/api/meetings/:meetingId/validate', (req, res) => {
  const { meetingId } = req.params;
  const meeting = meetings.get(meetingId.toUpperCase());
  
  if (!meeting) {
    return res.status(404).json({ valid: false, error: 'Meeting not found' });
  }
  
  if (!meeting.isActive) {
    return res.status(400).json({ valid: false, error: 'Meeting is not active' });
  }
  
  res.json({ valid: true, meeting });
});

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join meeting
  socket.on('join-meeting', ({ meetingId, userName, userId }) => {
    const meeting = meetings.get(meetingId.toUpperCase());
    
    if (!meeting) {
      socket.emit('error', { message: 'Meeting not found' });
      return;
    }

    socket.join(meetingId.toUpperCase());
    
    const participant = {
      id: userId || socket.id,
      socketId: socket.id,
      userName: userName || 'Anonymous',
      joinedAt: new Date().toISOString()
    };

    // Set host if first participant
    if (meeting.participants.length === 0) {
      meeting.hostId = participant.id;
    }

    meeting.participants.push(participant);
    
    // Notify others about new participant
    socket.to(meetingId.toUpperCase()).emit('user-joined', {
      participant,
      participants: meeting.participants
    });

    // Send current participants to the new user
    socket.emit('meeting-joined', {
      meetingId: meetingId.toUpperCase(),
      participants: meeting.participants,
      hostId: meeting.hostId
    });

    console.log(`${participant.userName} joined meeting ${meetingId}`);
  });

  // WebRTC Signaling: Offer
  socket.on('offer', ({ meetingId, offer, targetUserId }) => {
    socket.to(meetingId.toUpperCase()).emit('offer', {
      offer,
      fromUserId: socket.id,
      targetUserId
    });
  });

  // WebRTC Signaling: Answer
  socket.on('answer', ({ meetingId, answer, targetUserId }) => {
    socket.to(meetingId.toUpperCase()).emit('answer', {
      answer,
      fromUserId: socket.id,
      targetUserId
    });
  });

  // WebRTC Signaling: ICE Candidate
  socket.on('ice-candidate', ({ meetingId, candidate, targetUserId }) => {
    socket.to(meetingId.toUpperCase()).emit('ice-candidate', {
      candidate,
      fromUserId: socket.id,
      targetUserId
    });
  });

  // Chat message
  socket.on('chat-message', ({ meetingId, message, userName, userId }) => {
    const chatMessage = {
      id: uuidv4(),
      message,
      userName,
      userId,
      timestamp: new Date().toISOString()
    };
    
    io.to(meetingId.toUpperCase()).emit('chat-message', chatMessage);
  });

  // Screen sharing start
  socket.on('screen-share-start', ({ meetingId }) => {
    socket.to(meetingId.toUpperCase()).emit('screen-share-start', {
      userId: socket.id
    });
  });

  // Screen sharing stop
  socket.on('screen-share-stop', ({ meetingId }) => {
    socket.to(meetingId.toUpperCase()).emit('screen-share-stop', {
      userId: socket.id
    });
  });

  // Participant left
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find and remove participant from all meetings
    meetings.forEach((meeting, meetingId) => {
      const participantIndex = meeting.participants.findIndex(
        p => p.socketId === socket.id
      );
      
      if (participantIndex !== -1) {
        const participant = meeting.participants[participantIndex];
        meeting.participants.splice(participantIndex, 1);
        
        // If host left, assign new host
        if (meeting.hostId === participant.id && meeting.participants.length > 0) {
          meeting.hostId = meeting.participants[0].id;
        }
        
        // Notify others
        io.to(meetingId).emit('user-left', {
          participant,
          participants: meeting.participants,
          newHostId: meeting.hostId
        });
        
        // Clean up empty meetings after 5 minutes
        if (meeting.participants.length === 0) {
          setTimeout(() => {
            if (meetings.get(meetingId)?.participants.length === 0) {
              meetings.delete(meetingId);
              console.log(`Meeting ${meetingId} cleaned up`);
            }
          }, 5 * 60 * 1000);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

httpServer.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📹 Video meeting server ready`);
});

