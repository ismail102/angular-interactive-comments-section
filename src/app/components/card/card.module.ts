import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorComponent } from './author/author.component';
import { MessageComponent } from './message/message.component';
import { ModifyComponent } from './modify/modify.component';
import { ReplyComponent } from './reply/reply.component';
import { UpvotesComponent } from './upvotes/upvotes.component';

@NgModule({
  declarations: [
    AuthorComponent,
    MessageComponent,
    ModifyComponent,
    ReplyComponent,
    UpvotesComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AuthorComponent,
    MessageComponent,
    ModifyComponent,
    ReplyComponent,
    UpvotesComponent
  ]
})
export class CardModule { }
