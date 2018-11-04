import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PostService } from '../post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: BehaviorSubject<any[]> = new BehaviorSubject([]);
  filterPost: any;
  constructor(private service: PostService) {}

  ngOnInit() {
    this.service.getPosts().subscribe(posts => {
      this.posts.next(posts);
    });
  }
}
