# Video Meeting Feature Setup Guide

## Overview
This project includes a complete Google Meet-like video conferencing module with WebRTC, Socket.IO, and React.

## Features Implemented
- ✅ Meeting creation with unique IDs
- ✅ Join meeting by ID
- ✅ WebRTC video/audio streaming
- ✅ Screen sharing
- ✅ Real-time chat
- ✅ Participant list
- ✅ Audio/video controls
- ✅ Grid-based video layout
- ✅ Connection status indicators
- ✅ Meeting duration timer
- ✅ Host management
- ✅ Error handling and reconnection

## Installation

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

## Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd server
npm start
```

### Option 2: Run Both Together (if concurrently is installed)
```bash
npm run dev:all
```

## Environment Variables

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

## Usage

### Creating a Meeting
1. Navigate to `/meeting/create`
2. Click "Create Meeting"
3. Copy the meeting link or click "Join Now"

### Joining a Meeting
1. Navigate to `/meeting/join`
2. Enter the meeting ID
3. Click "Join Meeting"

Or use the direct link: `/meet/{meetingId}`

## API Endpoints

### Backend Server (Port 3001)

- `GET /api/meetings/create` - Create a new meeting
- `GET /api/meetings/:meetingId` - Get meeting details
- `POST /api/meetings/:meetingId/validate` - Validate meeting ID

### Socket.IO Events

**Client → Server:**
- `join-meeting` - Join a meeting
- `offer` - Send WebRTC offer
- `answer` - Send WebRTC answer
- `ice-candidate` - Send ICE candidate
- `chat-message` - Send chat message
- `screen-share-start` - Start screen sharing
- `screen-share-stop` - Stop screen sharing

**Server → Client:**
- `meeting-joined` - Confirmation of joining
- `user-joined` - New participant joined
- `user-left` - Participant left
- `offer` - Receive WebRTC offer
- `answer` - Receive WebRTC answer
- `ice-candidate` - Receive ICE candidate
- `chat-message` - Receive chat message
- `screen-share-start` - Someone started sharing
- `screen-share-stop` - Someone stopped sharing
- `error` - Error occurred

## Project Structure

```
src/
├── components/
│   └── meeting/
│       ├── VideoTile.tsx          # Individual video tile component
│       ├── ControlsBar.tsx         # Meeting controls
│       ├── ChatPanel.tsx           # Chat interface
│       ├── ParticipantList.tsx      # Participant list
│       └── MeetingRoom.tsx         # Main meeting room
├── hooks/
│   ├── useWebRTC.ts               # WebRTC hook
│   └── useMeetingSocket.ts        # Socket.IO hook
├── pages/
│   ├── CreateMeeting.tsx          # Create meeting page
│   └── JoinMeeting.tsx            # Join meeting page
├── types/
│   └── meeting.ts                 # TypeScript types
└── lib/
    └── meetingUtils.ts            # Utility functions

server/
└── index.js                       # Backend server with Socket.IO
```

## Browser Permissions

The application requires:
- Camera access
- Microphone access
- Screen sharing permissions (when using screen share)

## Troubleshooting

### Connection Issues
- Ensure backend server is running on port 3001
- Check CORS settings in server/index.js
- Verify Socket.IO connection in browser console

### Media Access Issues
- Check browser permissions for camera/microphone
- Try a different browser (Chrome/Firefox recommended)
- Ensure HTTPS in production (required for some features)

### WebRTC Issues
- Check firewall settings
- Verify STUN servers are accessible
- Check browser console for WebRTC errors

## Advanced Features (Optional)

Future enhancements could include:
- Meeting recording
- Waiting room
- Host controls (mute all, remove participants)
- Chat history persistence
- Meeting scheduling
- Authentication integration
- Meeting analytics

## Production Deployment

1. Build frontend:
```bash
npm run build
```

2. Deploy backend to a Node.js server
3. Update environment variables for production URLs
4. Use HTTPS (required for WebRTC in production)
5. Configure proper CORS settings
6. Set up TURN servers for better connectivity

## Support

For issues or questions, check:
- Browser console for errors
- Server logs for backend issues
- Network tab for API/Socket.IO connection issues

