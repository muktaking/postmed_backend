import {
  Body,
  Controller,
  Delete,
  Get,
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
import * as fs from "fs";
import { diskStorage } from "multer";
import * as sharp from "sharp";
import { Role } from "../roles.decorator";
import { RolesGuard } from "../roles.guard";
import { RolePermitted } from "../users/user.entity";
import { editFileName, imageFileFilter } from "../utils/file-uploading.utils";
import { CategoriesService } from "./categories.service";
import { createCategoryDto } from "./dto/category.dto";

// const serverConfig = config.get('server');
// const SERVER_URL = `${serverConfig.url}:${serverConfig.port}/`
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @Role(RolePermitted.mentor)
  async getAllCategories() {
    return await this.categoriesService.findAllCategories();
  }

  @Get("/*")
  @Role(RolePermitted.mentor)
  async getCategory(@Req() req) {
    return await this.categoriesService.findCategoryBySlug(
      "Top_" + req.params[0].replace("/", "_")
    );
  }

  @Post()
  @Role(RolePermitted.moderator)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./uploads/images",
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async createCategory(
    @Body() createCategoryDto: createCategoryDto,
    @UploadedFile() image
  ) {
    if (!image) {
      throw new Error("Image is not Selected");
    }

    const resizeImage = await sharp(image.path)
      .resize(350, 180)
      .png()
      .toBuffer();

    const resizeImageName = image.filename.split(".")[0] + "_350_180.png";

    const resizeImagePathName = "./uploads/images/" + resizeImageName;

    fs.writeFileSync(resizeImagePathName, resizeImage);

    return await this.categoriesService.createCategory(createCategoryDto, {
      filename: resizeImageName,
    });
  }

  @Patch()
  @Role(RolePermitted.moderator)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./uploads/images",
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async updateCategory(
    @Body("id") id: string,
    @Body() createCategoryDto: createCategoryDto,
    @UploadedFile() image
  ) {
    return await this.categoriesService.updateCategory(
      id,
      createCategoryDto,
      image
    );
  }

  @Delete()
  @Role(RolePermitted.moderator)
  @UsePipes(ValidationPipe)
  async deleteCategoryById(@Body("id") id: string) {
    return await this.categoriesService.deleteCategoryById(id);
  }
}
