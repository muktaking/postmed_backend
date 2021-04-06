import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as fs from "fs";
import * as _ from "lodash";
import { to } from "src/utils/utils";
import * as XLSX from "xlsx";
import { CreateQuestionDto } from "./create-question.dto";
import { Question } from "./question.entity";
//import { Stem } from "./question.model";
import { QuestionRepository } from "./question.repository";
import { Stem } from "./stem.entity";
import moment = require("moment");

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionRepository)
    private questionRepository: QuestionRepository
  ) {}

  async findAllQuestions() {
    const [err, questions] = await to(this.questionRepository.find());
    console.log(err);
    if (err) throw new InternalServerErrorException();
    return questions;
  }

  async findQuestionById(id) {
    const [err, question] = await to(this.questionRepository.findOne(+id));
    console.log(err);
    if (err) throw new InternalServerErrorException();
    return question;
  }

  async findQuestionByFilter(filterName, filterValue) {
    //filterName = filterName === "id" ? "_id" : filterName;
    const [err, result] = await to(
      this.questionRepository.find({ where: { [filterName]: +filterValue } })
    );
    if (err) throw new InternalServerErrorException();
    return result;
  }

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
    stem: { stem: Stem[]; error: string },
    creator: string
  ) {
    const {
      title,
      category,
      qType,
      qText,
      generalFeedback,
      tags,
    } = createQuestionDto;

    const stems = [];

    stem.stem.forEach((element) => {
      const stem = new Stem();
      stem.qStem = element.qStem;
      stem.aStem = element.aStem;
      stem.fbStem = element.fbStem;
      stems.push(stem);
    });

    const question = new Question();
    question.title = title;
    question.categoryId = +category;
    question.qType = qType;
    question.qText = qText;
    question.generalFeedback = generalFeedback ? generalFeedback : null;
    question.tags = tags ? tags.join(",") : null;
    question.creatorId = +creator;
    question.stems = stems;

    const [err, result] = await to(question.save());
    if (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
    return { result, message: stem.error };
  }

  async createQuestionByUpload(creator, category, file) {
    let excel = "";
    let data = [];
    try {
      excel = file.path;
      const workbook = XLSX.readFile(excel);
      data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
        header: 1,
        raw: false,
        defval: "",
      });
      //console.log(data);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    fs.unlink(excel, (err) => {
      if (err) {
        console.log(err);
      }
    });

    data.shift();
    const result = this.toCollection(data, category, creator);

    if (result.errorMessage.length > 0) {
      const msg = result.errorMessage
        .map((msg, ind) => result.errorIndex[ind] + ". " + msg)
        .join("; ");
      throw new HttpException(msg, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (result.allData.length > 0) {
      const [err, isSaved] = await to(
        this.questionRepository.save(result.allData)
      );
      if (err) throw new InternalServerErrorException();
      return isSaved;
    }
  }

  async updateQuestionById(
    id: string,
    createQuestionDto: CreateQuestionDto,
    stem: { stem: Stem[]; error: string },
    modifiedBy: string
  ) {
    const {
      title,
      category,
      qType,
      qText,
      generalFeedback,
      tags,
    } = createQuestionDto;

    const stems = [];

    stem.stem.forEach((element) => {
      const stem = new Stem();
      stem.qStem = element.qStem;
      stem.aStem = element.aStem;
      stem.fbStem = element.fbStem;
      stems.push(stem);
    });

    const oldQuestion = await this.questionRepository
      .findOne(+id)
      .catch((e) => {
        console.log(e);
        throw new HttpException(
          "Could not able to fetch oldQuestion from database ",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      });

    const newQuestion = { ...oldQuestion };
    newQuestion.title = title;
    newQuestion.categoryId = +category;
    newQuestion.qType = qType;
    newQuestion.qText = qText;
    newQuestion.generalFeedback = generalFeedback ? generalFeedback : null;
    newQuestion.tags = tags ? tags.join(",") : null;
    newQuestion.modifiedDate = moment().format("YYYY-MM-DD HH=mm=sss");
    newQuestion.modifiedById = +modifiedBy;
    newQuestion.stems = stems;

    await this.questionRepository.delete(+id);
    return await this.questionRepository.save(newQuestion);
  }

  async deleteQuestion(...args) {
    const res = await this.questionRepository.delete(args);
    return { message: "Question deleted successfully" };
  }

  // function to validate and convert uploaded excel data into a collection
  private toCollection(data, category, user) {
    // const category = category;
    // const user = user;
    const allData = [];
    const errorIndex = [];
    const errorMessage = [];

    data.forEach((element, index) => {
      const stems = [];

      //validating inputs
      //title(0),qtype(1),text(2),stem(3-7),ans(8-12),feed(13-17),gf(18),tags(19)
      if (element[0] === "") {
        errorIndex.push(index + 1);
        errorMessage.push("A question Title can not be Empty");
        return;
      }
      if (element[1] === "") {
        errorIndex.push(index + 1);
        errorMessage.push("A question Type can not be Empty");
        return;
      }
      if (element[2] === "") {
        errorIndex.push(index + 1);
        errorMessage.push("A question Text can not be Empty");
        return;
      }
      if (element[3] === "") {
        errorIndex.push(index + 1);
        errorMessage.push("First stem can not be empty.");
        return;
      }
      for (let i = 3; i < 8; i++) {
        if (element[i] === "" && element[i + 10] !== "") {
          errorIndex.push(index + 1);
          errorMessage.push("Feedback Can not be on empty stems.");
          return;
        }
      }
      if (element[1] === "matrix") {
        for (let i = 3; i < 8; i++) {
          if (
            (element[i] !== "" && element[i + 5] === "") ||
            (element[i + 5] !== "" && element[i] === "")
          ) {
            errorIndex.push(index + 1);
            errorMessage.push(
              "Stem should have corresponding answer and vice versa."
            );
            return;
          }
        }
      }

      for (let i = 3; i < 8; i++) {
        let stem: {
          qStem: string;
          aStem: string;
          fbStem: string;
        } = {
          qStem: "",
          aStem: "",
          fbStem: "",
        };
        stem.qStem = element[i] !== "" ? element[i] : null;
        stem.aStem = element[i + 5] !== "" ? element[i + 5] : null;
        stem.fbStem = element[i + 10] !== "" ? element[i + 10] : null;
        //console.log("----------------", stem);
        if (stem.qStem) stems.push(stem);
      }

      allData.push({
        title: element[0],
        categoryId: category,
        creatorId: +user,
        qType: element[1],
        qText: element[2],
        stems: stems,
        generalFeedback: element[18],
        tags: _.words(element[19]).toString(),
      });
    });
    return {
      allData,
      errorIndex,
      errorMessage,
    };
  }
}
