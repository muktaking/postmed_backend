import { BaseEntity, Timestamp } from 'typeorm';
import { Stem } from './stem.entity';
export declare enum QType {
    singleBestAnswer = "sba",
    Matrix = "matrix"
}
export declare class Question extends BaseEntity {
    id: number;
    title: string;
    categoryId: number;
    qType: QType;
    qText: string;
    stems: Stem[];
    generalFeedback: string;
    tags: string;
    createDate: Timestamp;
    modifiedDate: Timestamp | string;
    creatorId: number;
    modifiedById: number;
}
