import { Component, Input, OnInit } from '@angular/core';
import { Comment } from 'src/app/models/comment';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css'],
})
export class ReplyComponent implements OnInit {

  @Input() parentComment: Comment;

  constructor() {
    this.parentComment = {
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
  }

  isTextArea: boolean = false;

  ngOnInit(): void {
    this.isTextArea = false;
  }

  onReply() {
    // console.log("Prent Comment: ", this.parentComment)
    this.isTextArea = true;
  }
  onCancel() {
    this.isTextArea = false;
  }
}
