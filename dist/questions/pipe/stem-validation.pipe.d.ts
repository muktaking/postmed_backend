import { PipeTransform } from "@nestjs/common";
import { Stem } from "../question.model";
export declare class StemValidationPipe implements PipeTransform {
    transform(stem: any): {
        stem: Stem;
        error: string;
    };
}
