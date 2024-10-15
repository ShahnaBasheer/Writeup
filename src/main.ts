import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { mergeApplicationConfig } from '@angular/core';
import { authConfig } from './app/features/auth/auth.config';
import { articleConfig } from './app/features/articles/articles.config';


const mergedConfig = mergeApplicationConfig(appConfig, authConfig, articleConfig);


bootstrapApplication(AppComponent, mergedConfig)
  .catch((err) => console.error(err));
