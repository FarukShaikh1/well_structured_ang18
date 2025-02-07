export interface AddChatDto {
    receiverId: string;
    message: string;
    messageTypeId?: MessageType;
}

export enum MessageType {
    Image='5f72b993-6ac7-40bf-9fb0-03670ff4d45c',
    Text='33f7e445-93b3-490d-bd3d-449f23cdeb9a'
  }
  