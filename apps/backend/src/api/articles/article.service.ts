import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './article.schema';
import { CreateArticleDto } from './create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}
  async create(dto: CreateArticleDto): Promise<Article> {
    return await this.articleModel.create(dto);
  }
  async findAll(): Promise<Article[]> {
    return await this.articleModel.find().exec();
  }
  async findById(id: string): Promise<Article | null> {
    return await this.articleModel.findById(id).exec();
  }
  async findReviewed(): Promise<Article[]> {
    return await this.articleModel.find({ isModerated: true }).exec();
  }
  async findUnmoderated(): Promise<Article[]> {
    return await this.articleModel.find({ isModerated: false }).exec();
  }
  async moderate(id: string): Promise<Article | null> {
    return await this.articleModel.findByIdAndUpdate(
      id,
      { isModerated: true },
      { new: true },
    );
  }
}
