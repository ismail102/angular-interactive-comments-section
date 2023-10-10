import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { AuthorComponent } from './components/card/author/author.component';
import { MessageComponent } from './components/card/message/message.component';
import { UpvotesComponent } from './components/card/upvotes/upvotes.component';
import { ReplyComponent } from './components/card/reply/reply.component';
import { CommentCardComponent } from './components/comment-card/comment-card.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    AuthorComponent,
    MessageComponent,
    UpvotesComponent,
    ReplyComponent,
    CommentCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
