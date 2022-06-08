import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";

import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatExpansionModule } from "@angular/material/expansion"

import { NavigationComponent } from "./components/navigation/navigation.component";
import { SignupComponent } from "./components/signup/signup.component";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { PostsComponent } from "./components/posts/posts.component";
import { CreatePostComponent } from "./components/create-post/create-post.component";

import { AuthInterceptorService } from "./services/auth-interceptor.service";
import { AzureComponent } from './components/azure/azure.component';
import { Panel1Component } from './components/panel1/panel1.component';
import { Panel2Component } from './components/panel2/panel2.component';
import { Panel3Component } from './components/panel3/panel3.component';
import { Panel4Component } from './components/panel4/panel4.component';
import { Panel5Component } from './components/panel5/panel5.component';
import { TableComponent } from './components/table/table.component';
import { Panel6Component } from './components/panel6/panel6.component';
import { BottomTableComponent } from './components/bottomTable/bottomTable.component';

import { MyTableComponent } from './components/my-table/my-table.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    SignupComponent,
    LoginComponent,
    HomeComponent,
    PostsComponent,
    CreatePostComponent,
    AzureComponent,
    Panel1Component,
    Panel2Component,
    Panel3Component,
    Panel4Component,
    Panel5Component,
    TableComponent,
    Panel6Component,
    BottomTableComponent,
    MyTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatExpansionModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
