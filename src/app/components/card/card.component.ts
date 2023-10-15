import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Comment } from 'src/app/models/comment';
import Reply from 'src/app/models/reply';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() comment: Comment;

  @Input() currentUser: User;

  @Input() reply: Reply;

  replyClass: string = '';

  commentToUpdate: string = '';

  me: boolean = false;

  constructor() {
    this.comment = {
      id: 0,
      content: '',
      createdAt: '',
      score: 0,
      user: {
        image: {
          png: '',
          webp: '',
        },
        username: '',
      },
      replies: [],
    };
    this.currentUser = {
      image: {
        png: '',
        webp: '',
      },
      username: '',
    };
    this.reply = {
      id: 0,
      content: '',
      createdAt: '',
      score: 0,
      replyingTo: '',
      user: this.currentUser,
    };
  }

  ngOnInit(): void {
    this.commentToUpdate = this.comment.content;
  }
}
