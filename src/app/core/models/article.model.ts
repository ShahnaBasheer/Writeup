

// shared/models/article.model.ts

export interface Article {
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt?: Date;
  published?: boolean;
}
