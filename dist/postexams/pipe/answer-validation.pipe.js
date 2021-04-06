"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const validator = require("validator");
class AnswerValidationPipe {
    transform(answers) {
        const errorMessage = [];
        answers = answers.filter((answer) => {
            let msg;
            msg = validator.isEmpty(answer.id) ? "Answer id can not be empty" : null;
            msg = !validator.isNumeric(answer.id) ? "Answer id is not a Id" : null;
            errorMessage.push(msg);
            if (msg)
                return false;
            answer.stems.map((v) => {
                if (v)
                    msg = validator.isNumeric(v) ? null : "stem value is not allowed";
            });
            errorMessage.push(msg);
            if (msg)
                return false;
            msg = validator.isIn(answer.type, ["matrix", "sba"])
                ? null
                : "Answer type is not allowed";
            errorMessage.push(msg);
            if (msg)
                return false;
            return true;
        });
        if (answers.length > 0) {
            return answers;
        }
        else
            throw new common_1.BadRequestException(errorMessage.toString());
    }
}
exports.AnswerValidationPipe = AnswerValidationPipe;
//# sourceMappingURL=answer-validation.pipe.js.map