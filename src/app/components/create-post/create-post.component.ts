import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl, FormGroup, Validators, NgForm } from "@angular/forms";

import { first } from "rxjs/operators";

import { Post } from "src/app/models/Post";

import { AuthService } from "src/app/services/auth.service";
import { PostService } from "src/app/services/post.service";

@Component({
  selector: "app-create-post",
  templateUrl: "./create-post.component.html",
  styleUrls: ["./create-post.component.scss"],
})
export class CreatePostComponent implements OnInit {
  @ViewChild("formDirective") formDirective: NgForm;
  @Output() create: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  dataList = []
  isOpen = false;

  constructor(
    private authService: AuthService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    this.form = this.createFormGroup();
    // console.log('iddd', this.authService.userId)
    this.getList()
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      title: new FormControl("", [
        Validators.required,
        Validators.minLength(5),
      ]),
      body: new FormControl("", [
        Validators.required,
        Validators.minLength(10),
      ]),
    });
  }

  onSubmit(formData: Pick<Post, "title" | "body">): void {
    // console.log('formData.title,formData.body, this.authService.userId', formData.title, formData.body, this.authService.userId)
    this.postService
      .createPost(formData.title, formData.body, this.authService.userId)
      .pipe(first())
      .subscribe(() => {
        this.create.emit(null);
        this.dataList.push(formData)
      });
    this.form.reset();
    this.formDirective.resetForm();
  }

  getList() {
    const list = this.postService.list()
    list.subscribe((resp: any) => {
      // console.log('resp', resp.posts)
      this.dataList = resp.posts
      // console.log('this.dataList', this.dataList)
      // if (resp.success === true) {
      //     this.dataList = resp.data.data
      //     this.pagination = resp.data
      //     this.dataStatus = 'done'
      // }
    })
  }
  delete(index) {
    let id = this.dataList[index].id
    // console.log('did',id)
    this.postService.delete(id).subscribe((resp: any) => {
      this.dataList.splice(index, 1)
    }
    )
  }

}
