

// shared/models/article.model.ts

import { User } from "./user.model";

export interface Article {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  content: string;
  category: string;
  author: User;
  image: string;
  createdAt: Date;
  updatedAt?: Date;
}
