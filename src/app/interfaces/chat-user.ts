import { MessageType } from './add-chat-dto';

export interface ChatUser {
    id: string;
    userName: string;
    email:string;
    role:string;
    unreadMessageCount:number;
    lastMessage:string
    lastMessageTypeId:MessageType;
    lastMessageSender:string;
    lastMessageStatus:boolean;
    lastMessageTime:Date;
}
