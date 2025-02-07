export interface ChatMessage {
    senderId?: string;
    sender?: string;
    receiverId?: string;
    receiver?: string;
    message: string;
    createdOn: Date;
    sentByLoggedUser?: boolean;
    isMessageRead?: boolean;
    messageTypeId: string;
  }
