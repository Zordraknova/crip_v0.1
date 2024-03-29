import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostPageComponent } from './post-page/post-page.component';
import { HomeComponent } from './home/home.component';

import { CreatePostComponent } from './admin/create-post/create-post.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'singin', component: LoginComponent },
  { path: 'new_post', component: CreatePostComponent },
  { path: 'post', component: PostPageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
