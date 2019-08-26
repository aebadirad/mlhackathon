import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { GraphComponent } from './graph/graph.component';
import { StoryComponent } from './story/story.component';
import { DetailsComponent } from './details/details.component';


export const ROUTES: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'details', component: DetailsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'story', component: StoryComponent }
];
