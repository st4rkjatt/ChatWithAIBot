export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'image' | 'file';
  isRead: boolean;
  voiceData?: VoiceData;
}

export interface VoiceData {
  duration: number;
  audioUrl?: string;
  transcript?: string;
  confidence: number;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
  unreadCount: number;
}

export interface VoiceCommand {
  action: 'send' | 'read' | 'show' | 'call' | 'search';
  recipient?: string;
  message?: string;
  confidence: number;
  rawTranscript: string;
}

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  confidence?: number;
}


export interface UserMap {
  [key: string]: string;
}