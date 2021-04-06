import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Role } from "src/roles.decorator";
import { RolesGuard } from "src/roles.guard";
import { RolePermitted } from "src/users/user.model";
import { editFileName, excelFileFilter } from "../utils/file-uploading.utils";
import { CreateQuestionDto } from "./create-question.dto";
import { StemValidationPipe } from "./pipe/stem-validation.pipe";
import { QuestionsService } from "./questions.service";
import { Stem } from "./stem.entity";

@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("questions")
export class QuestionsController {
  constructor(private readonly questionService: QuestionsService) {}

  @Get()
  @UseGuards(AuthGuard("jwt"))
  @Role(RolePermitted.mentor)
  async getAllQuestions() {
    return await this.questionService.findAllQuestions();
  }

  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  @Role(RolePermitted.mentor)
  async getQuestionById(@Param() id) {
    return await this.questionService.findQuestionById(id.id);
  }

  @Role(RolePermitted.moderator)
  @Get("/category/:id")
  async getQuestionsByCategory(@Param() categoryId) {
    return await this.questionService.findQuestionByFilter(
      "categoryId",
      categoryId.id
    );
  }
  @Post()
  @Role(RolePermitted.mentor)
  @UsePipes(ValidationPipe)
  async createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @Body("stem", StemValidationPipe) stem: { stem: Stem[]; error: string },
    @Req() req
  ) {
    return await this.questionService.createQuestion(
      createQuestionDto,
      stem,
      req.user.id
    );
  }

  @Post("/files")
  @Role(RolePermitted.mentor)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/files",
        filename: editFileName,
      }),
      fileFilter: excelFileFilter,
    })
  )
  async createQuestionByUpload(
    @Req() req,
    @Body("category") category: string,
    @UploadedFile() file: string
  ) {
    return await this.questionService.createQuestionByUpload(
      req.user.id,
      category,
      file
    );
  }

  @Patch("/:id")
  @Role(RolePermitted.mentor)
  async updateQuestionById(
    @Param() questionId,
    @Body() createQuestionDto: CreateQuestionDto,
    @Body("stem", StemValidationPipe) stem: { stem: Stem[]; error: string },
    @Req() req
  ) {
    //console.log(questionId.id, createQuestionDto, stem, req.user.id);
    return await this.questionService.updateQuestionById(
      questionId.id,
      createQuestionDto,
      stem,
      req.user.id
    );
  }

  @Delete("/:id")
  @Role(RolePermitted.moderator)
  async deleteQuestionById(@Param() questionId) {
    return await this.questionService.deleteQuestion(questionId.id);
  }

  @Delete()
  @Role(RolePermitted.coordinator)
  async deleteQuestion(@Body() questionIds) {
    return await this.questionService.deleteQuestion(...questionIds.ids);
  }
}
