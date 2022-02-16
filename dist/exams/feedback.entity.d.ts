import { BaseEntity } from 'typeorm';
import { Exam } from './exam.entity';
export declare enum FeedbackStatus {
    belowAverage = 1,
    average = 2,
    good = 3,
    best = 4
}
export declare enum Status {
    Pending = "pending",
    Published = "published"
}
export declare class Feedback extends BaseEntity {
    id: number;
    name: string;
    email: string;
    examId: number;
    exam: Exam;
    status: Status;
    feedbackStatus: FeedbackStatus;
    message: string;
}
