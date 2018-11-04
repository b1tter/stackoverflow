import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Comment, CommentParams, CommentService } from '../comment.service';
import { Post, PostParams, PostService} from '../post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  comments: BehaviorSubject<Comment[]> = new BehaviorSubject([]);
  // form
  answerForm: FormGroup;
  post: Post;
  public answer: string;
  public likes = 0;
  public dislikes = 0;
  public postId: string;
  public title: string;
  public description: string;


  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService,
    private af: FormBuilder,
    private service: PostService
  ) {
    this.generateFrom();
  }

  generateFrom() {
    this.answerForm = this.af.group({
      answer: ['', Validators.required]
    });
  }

  ngOnInit() {
    const postId = this.getPostId();
    // Every time you navigate to this component it gets comments for postId
    this.commentService.getCommentsForPostId(postId).subscribe(comments => {
      this.comments.next(comments);
    });

    this.service.getPostById(postId).subscribe(post => {
      this.title = post.title;
      this.description = post.description;
    });
  }

  likeButton() {
    this.likes++;
  }

  dislikeButton() {
    this.dislikes++;
  }

  addComment() {
    const postId = this.getPostId();
    // Create a new comment
    const comment = { postId, ...this.answerForm.value };

    if (this.answerForm.valid) {
      this.commentService
        .create(comment)
        // fetch all comments for the postId again
        .pipe(mergeMap(() => this.commentService.getCommentsForPostId(postId)))
        .subscribe(comments => {
          this.comments.next(comments);
          this.answerForm.reset();
        });
    }
  }

  private getPostId() {
    const route = this.route.snapshot;
    const postId = route.paramMap.get('postId');
    return postId;
  }
}
