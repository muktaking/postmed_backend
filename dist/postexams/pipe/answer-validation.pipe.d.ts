import { PipeTransform } from "@nestjs/common";
import { StudentAnswer } from "../postexam.model";
export declare class AnswerValidationPipe implements PipeTransform {
    transform(answers: StudentAnswer[]): StudentAnswer[];
}
