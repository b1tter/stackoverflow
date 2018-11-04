import { Component, OnInit } from "@angular/core";
import { PostService, PostParams, Post } from "../post.service";
import { BehaviorSubject } from "rxjs";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-new-post",
  templateUrl: "./new-post.component.html",
  styleUrls: ["./new-post.component.css"]
})
export class NewPostComponent implements OnInit {
  title: string;
  description: string;
  id: string;
  // form
  postForm: FormGroup;
  post: BehaviorSubject<Post[]> = new BehaviorSubject([]);

  constructor(
    private service: PostService,
    private pf: FormBuilder,
    private router: Router
  ) {
    this.createFrom();
  }

  createFrom() {
    this.postForm = this.pf.group({
      title: ["", Validators.required],
      description: ["", Validators.required]
    });
  }

  addPost() {
    const post = {
      id: this.id,
      title: this.title,
      description: this.description
    };
    if (this.postForm.valid) {
      this.service.createPost(post).subscribe(() => {
        this.router.navigate(["/posts"]);
      });
    }
  }

  ngOnInit() {}
}
