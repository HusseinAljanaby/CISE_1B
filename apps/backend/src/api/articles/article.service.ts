/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}
  async create(dto: CreateArticleDto): Promise<Article> {
    return await this.articleModel.create(dto);
  }
  async find(query: any): Promise<Article[]> {
    if (query.all === 'true' || Object.keys(query).length === 0) {
      return await this.findAll();
    }

    const filter: any = {};

    if (query.title) {
      filter.title = { $regex: query.title, $options: 'i' };
    }

    if (query['authors[]']) {
      const authorsArray = Array.isArray(query['authors[]'])
        ? query['authors[]']
        : [query['authors[]']];

      if (authorsArray.length > 0) {
        filter.authors = { $in: authorsArray };
      }
    }

    if (query.source) {
      filter.source = { $regex: query.source, $options: 'i' };
    }

    // Publication year range filtering
    if (query.publication_year_start || query.publication_year_end) {
      filter.publication_year = {};
      if (query.publication_year_start) {
        filter.publication_year.$gte = Number(query.publication_year_start);
      }
      if (query.publication_year_end) {
        filter.publication_year.$lte = Number(query.publication_year_end);
      }
    }

    if (query.doi) {
      filter.doi = query.doi;
    }

    console.log('Query:', query);
    console.log('Filter:', filter);

    return await this.articleModel.find(filter).exec();
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
