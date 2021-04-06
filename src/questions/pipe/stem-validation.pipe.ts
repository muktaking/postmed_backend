import { BadRequestException, PipeTransform } from "@nestjs/common";
import * as validator from "validator";
import { Stem } from "../question.model";

export class StemValidationPipe implements PipeTransform {
  transform(stem: any): { stem: Stem; error: string } {
    const errorMessage: Array<string> = [];
    let qStem, aStem, fbStem;
    try {
      stem = stem.filter((v, i) => {
        //console.log(v.aStem);
        let error: Array<string> = [];
        let msg;
        qStem = v.qStem.trim();
        aStem = v.aStem.trim();
        fbStem = v.fbStem ? v.fbStem.trim() : null;
        //console.log(aStem);
        msg = validator.isLength(qStem, { min: 1, max: 200 })
          ? null
          : `Question of stem_${i} is empty or more than 200`;
        if (msg) error.push(msg);
        msg = validator.isLength(aStem, { min: 1, max: 200 })
          ? null
          : `Answer of stem_${i} is empty or more than 200`;
        if (msg) error.push(msg);
        if (fbStem) {
          msg = validator.isLength(fbStem, { min: 1, max: 200 })
            ? null
            : `feedback of stem_${i} more than 200`;
          if (msg) error.push(msg);
        }
        if (error.length > 0) {
          errorMessage.push(error.toString());
          return false;
        }

        return true;
      });
    } catch (error) {
      throw new BadRequestException(`Stem should properly shaped`);
    }
    // if (errorMessage.length > 0) {
    //   throw new BadRequestException(errorMessage.toString());
    // }
    if (stem.length > 0) {
      return { stem, error: errorMessage.toString() };
    } else throw new BadRequestException(errorMessage.toString());
  }
}
