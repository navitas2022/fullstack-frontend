import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
// message:any;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {

     return new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
      ]),
    });
    // return new FormGroup({
    //   email: new FormControl("testuser@gmail.com", [Validators.required, Validators.email]),
    //   password: new FormControl("test123", [
    //     Validators.required,
    //     Validators.minLength(7),
    //   ]),
    // });
  }

  login(): void {
    const login =  this.authService.login(this.loginForm.value.email, this.loginForm.value.password)

      login.subscribe((resp: any): any => {
        // if (resp.success === false) {

          // this.message = resp;


      });
  }
}
