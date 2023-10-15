import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css'],
})
export class AuthorComponent implements OnInit {
  @Input()
  author: string = '';

  @Input()
  authorImg: string = '';

  @Input()
  createdAt: string = '';

  @Input()
  isMyComment: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (this.author === 'juliusomo') this.isMyComment = true;
  }
}
