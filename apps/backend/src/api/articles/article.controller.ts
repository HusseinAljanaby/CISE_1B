/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from './schemas/article.schema';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(@Body() dto: CreateArticleDto): Promise<Article> {
    return await this.articleService.create(dto);
  }

  @Get()
  async find(@Query() query: any): Promise<Article[]> {
    return await this.articleService.find(query);
  }

  @Get('/reviewed')
  async findReviewed(@Query() query: any): Promise<Article[]> {
    query.isModerated = 'true';
    query.isRejected = 'false';
    return await this.articleService.find(query);
  }

  @Get('/unmoderated')
  async findUnmoderated(): Promise<Article[]> {
    return await this.articleService.findUnmoderated();
  }

  @Get('/rejected')
  async findRejected(): Promise<Article[]> {
    return await this.articleService.findRejected();
  }

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<Article> {
    const article = await this.articleService.findById(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  @Put('/:id/moderate')
  async moderate(@Param('id') id: string): Promise<Article> {
    return await this.articleService.moderate(id);
  }

  @Put('/:id/reject')
  async reject(@Param('id') id: string): Promise<Article> {
    return await this.articleService.reject(id);
  }
}
