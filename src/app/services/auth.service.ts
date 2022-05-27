import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable, BehaviorSubject } from "rxjs";
import { first, catchError, tap, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "../models/User";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  //private url = "http://localhost:3000/auth";
//  private url = environment.URL + "/auth";
 private url = environment.URL + "/user";
  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId: -1;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  user: any;

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {}

  signup(user: Omit<User, "id">): Observable<User> {
    return this.http
      .post<User>(`${this.url}/signup`, user, this.httpOptions)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<User>("signup"))
      );
  }

  // login(
  //   email: Pick<User, "email">,
  //   password: Pick<User, "password">
  // ): Observable<{
  //   token: string;
  //   userId: Pick<User, "id">;
  // }> {
  //   return this.http
  //     .post(`${this.url}/login`, { email, password }, this.httpOptions)
  //     .pipe(
  //       first(),
  //       tap((tokenObject: { token: string; userId: Pick<User, "id"> }) => {
  //         // this.userId = tokenObject.userId;
  //         this.userId = tokenObject.userId;
  //         console.log(tokenObject.id)
  //         localStorage.setItem("token", tokenObject.token);
  //         this.isUserLoggedIn$.next(true);
  //         this.router.navigate(["home"]);
  //       }),
  //       catchError(
  //         this.errorHandlerService.handleError<{
  //           token: string;
  //           userId: Pick<User, "id">;
  //         }>("login")
  //       )
  //     );
  // }


  login(email, password ): Observable<any> {
    const url = `${this.url}/login`

    return this.http.post<any>(url, {email, password },this.httpOptions)
        .pipe(
            map(resp => {
                // if (resp && resp.success && resp.data.token) {
                    // localStorage.setItem('token', resp.data.token)
                    // localStorage.setItem('user', JSON.stringify(resp.data))
                    this.user = resp
                    // console.log('resp',resp.error.message)
                    this.userId = resp.id;
                    console.log('resp',resp)
                    console.log('userId',this.userId)
                    this.isUserLoggedIn$.next(true);
          this.router.navigate(["home"]);
                // }

                // return resp
            })
        )
}
}
