import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule], //Import FormsModule
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  searchTerm = '';
  selectedCategory: 'movie' | 'tv' | 'person' = 'movie';
  @Output() searchClicked = new EventEmitter<string>(); //Output the search term
  @Output() categoryClicked = new EventEmitter<'movie' | 'tv' | 'person'>();

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  onSearchClick() {
    this.searchClicked.emit(this.searchTerm);
  }

  onCategoryClick(category: 'movie' | 'tv' | 'person') {
    this.selectedCategory = category;
    this.categoryClicked.emit(category);
  }
}
