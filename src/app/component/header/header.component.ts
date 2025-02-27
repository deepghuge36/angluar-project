// header.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private router: Router) {}

  searchTerm = '';
  selectedCategory: 'all' | 'movie' | 'tv' | 'person' = 'all';
  @Output() searchClicked = new EventEmitter<string>();
  @Output() categoryClicked = new EventEmitter<'all' | 'movie' | 'tv' | 'person'>();

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  onSearchClick() {
    this.searchClicked.emit(this.searchTerm);
  }

  onCategoryClick(category: 'all' | 'movie' | 'tv' | 'person') {
    if (this.selectedCategory !== category) {
      this.selectedCategory = category;
      this.categoryClicked.emit(category);
    }
  }
}
