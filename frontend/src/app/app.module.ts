import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MaterialModule } from './mat.module';
import { HomeComponent } from './home/home.component';
import { PostPageComponent } from './post-page/post-page.component';
import { ProfileComponent } from './profile/profile.component';
import { CreatePostComponent } from './admin/create-post/create-post.component';
import { EditPostComponent } from './admin/edit-post/edit-post.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LoaderComponent } from './@shared/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './admin/login/login.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostPageComponent,
    ProfileComponent,
    CreatePostComponent,
    EditPostComponent,
    DashboardComponent,
    LoaderComponent,
    LoginComponent,

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
