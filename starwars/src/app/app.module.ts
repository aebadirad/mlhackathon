import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { GraphComponent } from './graph/graph.component';
import { SearchComponent } from './search/search.component';

import { StoryComponent} from './story/story.component';
import { ROUTES } from './app.routing';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [
    AppComponent,
    StoryComponent,
    GraphComponent,
    SearchComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
