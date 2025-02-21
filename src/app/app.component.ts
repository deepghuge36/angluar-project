//app.component.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListingComponent } from './tmdb/listing/listing.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListingComponent, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'test';
  searchQuery = '';
  selectedCategory: 'movie' | 'tv' | 'person' = 'movie';

  handleSearch(searchTerm: string) {
    this.searchQuery = searchTerm;
  }

  changeCategory(category: 'movie' | 'tv' | 'person') {
    this.selectedCategory = category;
  }
}
