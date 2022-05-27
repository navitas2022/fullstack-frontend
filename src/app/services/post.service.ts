import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError, first } from "rxjs/operators";

import { Post } from "../models/Post";
import { User } from "../models/User";
import { ErrorHandlerService } from "./error-handler.service";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class PostService {
  //private url = "http://localhost:3000/post";
 private url:any = environment.URL + "/post/";
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  fetchAll(): Observable<Post[]> {
    return this.http
      .get<Post[]>(this.url, { responseType: "json" })
      .pipe(
        catchError(this.errorHandlerService.handleError<Post[]>("fetchAll", []))
      );
  }

  list(): Observable<any> {
    console.log('list')
    const url = `${this.url}`
    return this.http.get<any>(url)
}
delete(id): Observable<any> {
  const url = `${this.url}/${id}`
  return this.http.delete<any>(url)
}


  // createPost(
  //   formData: Partial<Post>,
  //   userId: Pick<User, "id">
  // ): Observable<Post> {
  //   return this.http
  //     .post<Post>(
  //       this.url,
  //       { title: formData.title, body: formData.body, user: userId },
  //       this.httpOptions
  //     )
  //     .pipe(
  //       catchError(this.errorHandlerService.handleError<Post>("createPost"))
  //     );
  // }

  createPost(
    title,body,
    user
  ): Observable<Post> {
    return this.http
      .post<Post>(
        this.url,
        { title, body, user },
        this.httpOptions
      )
      .pipe(
        catchError(this.errorHandlerService.handleError<Post>("createPost"))
      );
  }

  deletePost(postId: Pick<Post, "id">): Observable<{}> {
    return this.http
      .delete<Post>(`${this.url}/${postId}`, this.httpOptions)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<Post>("deletePost"))
      );
  }
}
