import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: [String] }) // Array of authors
  authors: string[];

  @Prop()
  source: string;

  @Prop({ required: true })
  publication_year: number;

  @Prop({ required: true })
  doi: string;

  @Prop()
  summary: string;

  @Prop()
  linked_discussion: string;

  @Prop({ default: false })
  isModerated: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
