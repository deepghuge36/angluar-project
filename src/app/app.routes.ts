// app.routes.ts

import { Routes } from '@angular/router';
import { ListingComponent } from './tmdb/listing/listing.component';
import { TvComponent } from './detail/tv/tv.component';
import { MovieComponent } from './detail/movie/movie.component';
import { PersonComponent } from './detail/person/person.component';

export const routes: Routes = [
  { path: 'listing/all', component: ListingComponent },
  { path: 'movie/:id', component: MovieComponent },
  { path: 'tv/:id', component: TvComponent },
  { path: 'person/:id', component: PersonComponent },
  { path: 'listing/:category', component: ListingComponent },
  { path: '**', redirectTo: 'listing/all' },
];
