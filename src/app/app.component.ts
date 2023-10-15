import { Component } from '@angular/core';
import { CommentService } from './service/comment.service';
import { Comment } from './models/comment';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  //data: any = dataFake;
  //user: User = dataFake.currentUser;

  currentUser: User;
  comments: Comment[];

  constructor(private commentService: CommentService) {
    //console.log(this.user);
    this.currentUser = commentService.getUser();
    this.comments = commentService.getAllComments();
  }

  ngOnInit(): void {
    console.log('currentuser', this.currentUser);
    console.log('comments', this.comments);
  }
}
