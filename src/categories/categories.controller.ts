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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Role } from '../roles.decorator';
import { RolesGuard } from '../roles.guard';
import { RolePermitted } from '../users/user.entity';
import {
  editFileName,
  imageFileFilter,
  imageResizer,
} from '../utils/file-uploading.utils';
import { CategoriesService } from './categories.service';
import { createCategoryDto } from './dto/category.dto';

// const serverConfig = config.get('server');
// const SERVER_URL = `${serverConfig.url}:${serverConfig.port}/`
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  //@Role(RolePermitted.mentor)
  async getAllCategories() {
    return await this.categoriesService.findAllCategories();
  }

  @Get('/*')
  @Role(RolePermitted.mentor)
  async getCategory(@Req() req) {
    return await this.categoriesService.findCategoryBySlug(
      'Top_' + req.params[0].replace('/', '_')
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.moderator)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images/categories',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async createCategory(
    @Body() createCategoryDto: createCategoryDto,
    @UploadedFile() image
  ) {
    let imagePath = null;

    if (image) {
      try {
        imagePath = await imageResizer(image, 'categories');
      } catch (error) {
        console.log(error.message);
      }
    }

    return await this.categoriesService.createCategory(createCategoryDto, {
      filename: imagePath,
    });
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.moderator)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images/categories',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async updateCategory(
    @Body('id') id: string,
    @Body() createCategoryDto: createCategoryDto,
    @UploadedFile() image
  ) {
    let imagePath = null;

    if (image) {
      try {
        imagePath = await imageResizer(image, 'categories');
      } catch (error) {
        console.log(error.message);
      }
    }
    return await this.categoriesService.updateCategory(
      id,
      createCategoryDto,
      imagePath
    );
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role(RolePermitted.moderator)
  @UsePipes(ValidationPipe)
  async deleteCategoryById(@Body('id') id: string) {
    return await this.categoriesService.deleteCategoryById(id);
  }
}
