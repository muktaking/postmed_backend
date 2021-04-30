import { FeedbackStatus } from '../feedback.entity';
export declare class CreateFeedbackDto {
    examId: string;
    name: string;
    email: string;
    feedbackStatus: FeedbackStatus;
    message: string;
}
