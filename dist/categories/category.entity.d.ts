import { BaseEntity } from "typeorm";
export declare class Category extends BaseEntity {
    id: number;
    name: string;
    slug: string;
    description: string;
    parentId: number;
    imageUrl: string;
    order: number;
}
