import * as mongoose from "mongoose";
export interface Category extends mongoose.Document {
    id: string;
    name: string;
    slug: string;
    description: string;
    parentId: string;
    imageUrl: string;
    order: number;
}
export declare const CategorySchema: mongoose.Schema<any>;
