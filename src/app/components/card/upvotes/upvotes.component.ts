import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-upvotes',
  templateUrl: './upvotes.component.html',
  styleUrls: ['./upvotes.component.css'],
})
export class UpvotesComponent implements OnInit {
  @Input()
  score: number = 0;

  alreadyVoted: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  vote(param: string) {
    if(param === 'up' && !this.alreadyVoted) {
      this.score += 1;
      this.alreadyVoted = true;
      return;
    }

    if(param === 'down' && this.alreadyVoted) {
      this.score -= 1;
      this.alreadyVoted = false;
      return;
    }

  }
}
