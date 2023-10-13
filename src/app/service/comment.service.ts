import { Injectable } from '@angular/core';
import { dataFake } from 'src/data/data';

import { Comment } from 'src/app/models/comment'
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  comments: Comment[];
  currentUser: User;

  constructor() {
    this.comments = dataFake.comments;
    this.currentUser = dataFake.currentUser;
  }

  getUser() {
    return this.currentUser;
  }

  getAllComments() {
    return [...this.comments];
  }
}
