import { QType } from "./question.model";
export declare class CreateQuestionDto {
    id: string;
    title: string;
    category: string;
    qType: QType;
    qText: string;
    generalFeedback: string;
    tags: Array<string>;
}
