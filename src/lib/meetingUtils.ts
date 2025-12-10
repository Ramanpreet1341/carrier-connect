// Utility functions for meeting management

/**
 * Generate a unique meeting ID
 */
export const generateMeetingId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * Validate meeting ID format
 */
export const isValidMeetingId = (meetingId: string): boolean => {
  return /^[A-Z0-9]{6,}$/.test(meetingId.toUpperCase());
};

/**
 * Get user name from localStorage
 */
export const getUserName = (): string => {
  return localStorage.getItem('userName') || 'Anonymous User';
};

/**
 * Get user ID from localStorage or generate one
 */
export const getUserId = (): string => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
};

/**
 * Copy meeting link to clipboard
 */
export const copyMeetingLink = (meetingId: string): Promise<void> => {
  const link = `${window.location.origin}/meet/${meetingId}`;
  return navigator.clipboard.writeText(link);
};

/**
 * Get grid layout class based on participant count
 */
export const getGridLayoutClass = (count: number): string => {
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  if (count <= 4) return 'grid-cols-2';
  if (count <= 9) return 'grid-cols-3';
  if (count <= 16) return 'grid-cols-4';
  return 'grid-cols-5';
};

/**
 * Format time duration
 */
export const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

