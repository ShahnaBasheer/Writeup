import { Routes } from '@angular/router';
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



export const routes: Routes = [
  { path: '', component: UserComponent, canActivateChild: [ AuthGuard ], children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'details', component: DetailPageComponent},
    { path: 'profile', component: ProfileComponent },
    { path: 'myarticles', component: MyarticlespageComponent},
    { path: 'create', component: CreateArticleComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  ] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'interested/topics', component: InterestedTopicsComponent },
  { path: 'otp-verification', component: OtpVerificationComponent},
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];



