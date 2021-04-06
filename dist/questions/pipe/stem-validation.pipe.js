"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const validator = require("validator");
class StemValidationPipe {
    transform(stem) {
        const errorMessage = [];
        let qStem, aStem, fbStem;
        try {
            stem = stem.filter((v, i) => {
                let error = [];
                let msg;
                qStem = v.qStem.trim();
                aStem = v.aStem.trim();
                fbStem = v.fbStem ? v.fbStem.trim() : null;
                msg = validator.isLength(qStem, { min: 1, max: 200 })
                    ? null
                    : `Question of stem_${i} is empty or more than 200`;
                if (msg)
                    error.push(msg);
                msg = validator.isLength(aStem, { min: 1, max: 200 })
                    ? null
                    : `Answer of stem_${i} is empty or more than 200`;
                if (msg)
                    error.push(msg);
                if (fbStem) {
                    msg = validator.isLength(fbStem, { min: 1, max: 200 })
                        ? null
                        : `feedback of stem_${i} more than 200`;
                    if (msg)
                        error.push(msg);
                }
                if (error.length > 0) {
                    errorMessage.push(error.toString());
                    return false;
                }
                return true;
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(`Stem should properly shaped`);
        }
        if (stem.length > 0) {
            return { stem, error: errorMessage.toString() };
        }
        else
            throw new common_1.BadRequestException(errorMessage.toString());
    }
}
exports.StemValidationPipe = StemValidationPipe;
//# sourceMappingURL=stem-validation.pipe.js.map