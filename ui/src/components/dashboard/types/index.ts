export interface User {
  _id: string;
  name: string;
  username?: string;
  email?: string;
}

export interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
}
