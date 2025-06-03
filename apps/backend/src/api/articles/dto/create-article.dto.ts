/* eslint-disable prettier/prettier */
export class CreateArticleDto {
  title: string;
  authors: string[];
  source?: string;
  publication_year: number;
  doi: string;
  abstract?: string;
  linked_discussion?: string;
  isModerated?: boolean;
}
