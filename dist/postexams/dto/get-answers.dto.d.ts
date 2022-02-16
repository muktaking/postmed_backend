export declare class GetFreeAnswersDto {
    examId: string;
    timeTakenToComplete: string;
    questionIdsByOrder: number[];
}
export declare class GetAnswersDto extends GetFreeAnswersDto {
    courseId: string;
}
