import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject, NotFoundException,
  Param,
  Patch,
  Post, UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
  constructor(
    @Inject(TopPageService) private readonly topPageService: TopPageService,
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.createPage(dto);
  }


  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deleted = await this.topPageService.deletePageById(id);

    if (!deleted) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }

    return;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPageDto) {
    const updated = await this.topPageService.updatePageById(id, dto);

    if (!updated) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR)
    }

    return updated
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id', IdValidationPipe) id: string) {
    const page = await this.topPageService.findById(id);

    if (!page) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
    }

    return page;
  }

  @UsePipes(new ValidationPipe())
  @Post('find')
  async findByCategory(@Body() dto: FindTopPageDto) {
    const pages = await this.topPageService.findByCategory(dto)

    if (!pages) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR)
    }

    return pages
  }

  @Get('byAlias/:alias')
  async findByAlias(@Param('alias') alias: string) {
    const page = await this.topPageService.findByAlias(alias)

    if (!page) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR)
    }

    return page
  }

  @Get("textSearch/:text")
  async findByText(@Param('text') text: string) {
    const pages = await this.topPageService.findPageByText(text)

    if(!pages || pages.length < 1) {
      throw new NotFoundException(PAGE_NOT_FOUND_ERROR)
    }

    return pages
  }
}
