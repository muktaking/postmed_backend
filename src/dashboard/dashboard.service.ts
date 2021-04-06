import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryRepository } from "src/categories/category.repository";
import { ExamRepository } from "src/exams/exam.repository";
import { ExamsService } from "src/exams/exams.service";
import { UsersService } from "src/users/users.service";
import { to } from "src/utils/utils";
import { Like } from "typeorm";

@Injectable()
export class DashboardService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
    @InjectRepository(ExamRepository)
    private examRepository: ExamRepository,
    private readonly examService: ExamsService
  ) {
    this.featuredCategoryId = this.getFeaturedCategoryId();
  }

  private featuredCategoryId;

  async getFeaturedCategoryId() {
    const [err, category] = await to(
      this.categoryRepository.findOne({ name: "Featured" })
    );
    if (err) throw new InternalServerErrorException();
    return category ? category.id : null;
  }

  async getStudentDashInfo(email: string) {
    const [err, userExamInfo] = await to(
      this.examService.findUserExamInfo(email)
    );
    if (err) throw new InternalServerErrorException();
    const [err1, userExamStat] = await to(
      this.examService.findUserExamStat(email)
    );
    if (err1) throw new InternalServerErrorException();

    const featuredExams = await this.getFeaturedExams();

    return { userExamInfo, featuredExams, userExamStat };
  }

  async getAdminDashInfo(userRole) {
    const [err, users] = await to(this.usersService.findAllUsers(userRole));

    const [err1, exams] = await to(this.examService.findAllExams());
    return { users, exams };
  }

  async getFeaturedExams() {
    const [err, exams] = await to(
      this.examRepository.find({
        where: [
          {
            categoryIds: Like(
              "%," + (await this.featuredCategoryId).toString() + ",%"
            ),
          },
          {
            categoryIds: Like(
              (await this.featuredCategoryId).toString() + ",%"
            ),
          },
          {
            categoryIds: Like(
              "%," + (await this.featuredCategoryId).toString()
            ),
          },
        ],
        relations: ["categoryType"],
        order: { id: "DESC" },
        take: 5,
      })
    );
    if (err) throw new InternalServerErrorException();

    return exams;
  }
}
