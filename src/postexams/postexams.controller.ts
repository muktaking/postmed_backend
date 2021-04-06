import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetAnswersDto } from "./dto/get-answers.dto";
import { AnswerValidationPipe } from "./pipe/answer-validation.pipe";
import { StudentAnswer } from "./postexam.model";
import { PostexamsService } from "./postexams.service";

@Controller("postexams")
export class PostexamsController {
  constructor(private readonly postexamsService: PostexamsService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UsePipes(ValidationPipe)
  async postExamTasking(
    @Body() getAnswersDto: GetAnswersDto,
    @Body("answers", AnswerValidationPipe) answers: StudentAnswer[],
    @Req() req
  ) {
    return await this.postexamsService.postExamTasking(
      getAnswersDto,
      answers,
      req.user
    );
  }

  @Post("free")
  @UsePipes(ValidationPipe)
  async postExamTaskingForFree(
    @Body() getAnswersDto: GetAnswersDto,
    @Body("answers", AnswerValidationPipe) answers: StudentAnswer[]
  ) {
    return await this.postexamsService.postExamTaskingForFree(
      getAnswersDto,
      answers
    );
  }

  // @Get("/user/rank/:id")
  // @UseGuards(AuthGuard("jwt"))
  // @UsePipes(ValidationPipe)
  // async examRankByIdForUser(@Param("id") id, @Req() req) {
  //   return await this.postexamsService.examRankById(id, req._id);
  // }

  @Get("rank/:id")
  // @UseGuards(AuthGuard("jwt"))
  // @UsePipes(ValidationPipe)
  async examRankByIdForGuest(@Param("id") id) {
    return await this.postexamsService.examRankById(id);
  }
}
