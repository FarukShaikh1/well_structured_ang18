export interface SystemNotifications {
    notificationId: string;
    emailHistoryId: string;
    userId: string;
    notificationMessage: string;
    hasRead: boolean;
    createdBy: string;
    createdOn: Date;
    isLoading: boolean;
}
