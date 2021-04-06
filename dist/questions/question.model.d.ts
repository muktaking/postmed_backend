import * as mongoose from "mongoose";
export declare enum QType {
    singleBestAnswer = "sba",
    Matrix = "matrix"
}
export interface Stem {
    qStem: string;
    aStem: string;
    fbStem?: string;
}
export interface Question extends mongoose.Document {
    id: string;
    title: string;
    category: string;
    qType: QType;
    qText: string;
    stems: Array<Partial<Stem>>;
    generalFeedbacks: string;
    tags: Array<string>;
    createdAt: Date;
    modifiedAt: Date;
    creator: string;
}
export declare const QuestionSchema: mongoose.Schema<any>;
