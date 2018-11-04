import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../post.service';

@Pipe({
  name: 'searchPost'
})
export class SearchPostPipe implements PipeTransform {
  transform(post: Post[], filterPost: string): Post[] {
    if (!post || !filterPost) {
      return post;
    }

    return post.filter(posts => {
      return posts.title
        .toLocaleLowerCase()
        .includes(filterPost.toLocaleLowerCase());
    });
  }
}
