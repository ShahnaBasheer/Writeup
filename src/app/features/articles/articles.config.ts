import { ApplicationConfig } from "@angular/core";
import { ArticleService } from "./services/article.service";



export const articleConfig: ApplicationConfig = {
  providers: [
    ArticleService
  ],
};
