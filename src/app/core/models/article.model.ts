

// shared/models/article.model.ts

import { User } from "./user.model";


interface Article {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  content: string;
  category: string;
  author: User;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}


interface ArticleFormData {
  title: string;
  category: string;
  content: string;
  description: string;
  articleId?: string;
  image?: File; // Optional if an image is not always provided
}


interface ArticleResponse {
  message: string;
  data: {
    article?: Article;
    user?: User;
  }

}


export type { Article, ArticleFormData, ArticleResponse };
