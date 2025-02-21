import { Routes, CanActivateFn } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { UserComponent } from './shared/components/user/user.component';
import { DashboardComponent } from './features/articles/components/dashboard/dashboard.component';
import { DetailPageComponent } from './features/articles/components/detail-page/detail-page.component';
import { CreateArticleComponent } from './features/articles/components/create-article/create-article.component';
import { MyarticlespageComponent } from './features/articles/components/myarticlespage/myarticlespage.component';
import { OtpVerificationComponent } from './features/auth/components/otp-verification/otp-verification.component';
import { InterestedTopicsComponent } from './features/articles/components/interested-topics/interested-topics.component';
import { ProfileComponent } from './features/auth/components/profile/profile.component';
import { AuthGuard } from './core/guards/auth.guard';
import { EditArticleComponent } from './shared/components/edit-article/edit-article.component';



export const routes: Routes = [
  { path: '', component: UserComponent, canActivateChild: [ AuthGuard ], children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'details/:articleId', component: DetailPageComponent},
    { path: 'profile', component: ProfileComponent },
    { path: 'myarticles', component: MyarticlespageComponent},
    { path: 'create', component: CreateArticleComponent },
    { path: 'update/article/:articleId', component: EditArticleComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  ] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'interested/topics', component: InterestedTopicsComponent, canActivate: [AuthGuard] },
  { path: 'otp-verification', component: OtpVerificationComponent, canActivate: [AuthGuard]},
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];



