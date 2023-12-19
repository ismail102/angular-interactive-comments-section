import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';

import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { FormsModule } from '@angular/forms';
import { CommentService } from './service/comment.service';
import { CardModule } from './components/card/card.module';
import { ChartComponent } from './chart/chart.component';
import { ApiService } from './service/api.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, CardComponent, CommentCardComponent, ChartComponent],
  imports: [HttpClientModule,BrowserModule, FormsModule, AppRoutingModule, CardModule],
  providers: [CommentService, ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
