import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { PostsComponent } from "./posts/posts.component";
import { PostDetailComponent } from "./post-detail/post-detail.component";
import { NewPostComponent } from "./new-post/new-post.component";

const appRoutes: Routes = [
  { path: "posts", component: PostsComponent },
  { path: "posts/:postId", component: PostDetailComponent },
  { path: "new-post", component: NewPostComponent },
  { path: "**", redirectTo: "home" }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false })
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule {}
