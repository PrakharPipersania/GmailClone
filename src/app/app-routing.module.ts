import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { InboxComponent } from './inbox/inbox.component';
import { SentComponent } from './sent/sent.component';
import { StarredComponent } from './starred/starred.component';
import { TrashComponent } from './trash/trash.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';

const routes: Routes = [
    {
        path: '',
        component: SplashScreenComponent
    },
    {
        path: 'login',
        component: LoginPageComponent
    },
    {
        path: 'create-account',
        component: RegisterPageComponent
    },
    {
        path:"mail",
        component: SidebarComponent,
        children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: 'inbox'
        },
        {
            path: "inbox",
            component: InboxComponent
        },
        {
            path: "starred",
            component: StarredComponent
        },
        {
            path: "sent",
            component: SentComponent 
        },
        {
            path: "trash",
            component: TrashComponent
        },
        {
            path: '**',
            redirectTo: 'inbox'
        }]
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
