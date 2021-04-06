import { BadRequestException, PipeTransform } from "@nestjs/common";
import * as validator from "validator";
import { StudentAnswer } from "../postexam.model";

export class AnswerValidationPipe implements PipeTransform {
  transform(answers: StudentAnswer[]) {
    const errorMessage: Array<string> = [];
    answers = answers.filter((answer) => {
      let msg;
      msg = validator.isEmpty(answer.id) ? "Answer id can not be empty" : null;
      msg = !validator.isNumeric(answer.id) ? "Answer id is not a Id" : null;
      errorMessage.push(msg);

      if (msg) return false;
      answer.stems.map((v) => {
        if (v)
          msg = validator.isNumeric(v) ? null : "stem value is not allowed";
      });
      errorMessage.push(msg);
      if (msg) return false;

      msg = validator.isIn(answer.type, ["matrix", "sba"])
        ? null
        : "Answer type is not allowed";
      errorMessage.push(msg);
      if (msg) return false;
      return true;
    });

    if (answers.length > 0) {
      return answers;
    } else throw new BadRequestException(errorMessage.toString());
  }
}
