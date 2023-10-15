import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-upvotes',
  templateUrl: './upvotes.component.html',
  styleUrls: ['./upvotes.component.css'],
})
export class UpvotesComponent implements OnInit {
  @Input()
  score: number = 0;

  constructor() {}

  ngOnInit(): void {}
}
