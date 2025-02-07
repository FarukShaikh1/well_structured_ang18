export interface Feedback {
    userName: string;
    userId: string;
    profilePictureUrl: string;
    createdOn: Date;
    feedbackContent: string;
    parentId: number;
    feedbackId: string;
    categoryId: number;
    category: string;
    createdBy: string;
    updatedBy: string;
    updatedOn: Date;
    childFeedbacks: Feedback[];
}
