import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './create-article.dto';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(@Body() dto: CreateArticleDto) {
    return await this.articleService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.articleService.findAll();
  }

  @Get('/unmoderated')
  async findUnmoderated() {
    return await this.articleService.findUnmoderated();
  }

  @Put('/:id/moderate')
  async moderate(@Param('id') id: string) {
    return await this.articleService.moderate(id);
  }
}
