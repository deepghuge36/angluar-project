import {
  Component,
  Output,
  EventEmitter,
  computed,
  effect,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AccountStore } from '../../tmdb/store/tmdb.store';
import { TmdbAuthService } from '../../tmdb/services/tmdb-auth.service';
import { TmdbService } from '../../tmdb.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  accountDetails = computed(() => this.accountStore.accountDetails()); // Make it reactive

  constructor(
    private router: Router,
    private accountStore: AccountStore,
    private tmdbAuthService: TmdbAuthService,
    private tmdbService: TmdbService,
    private cdr: ChangeDetectorRef
  ) {
    effect(() => {
      console.log('Account Details Updated: in header', this.accountDetails());
      this.cdr.detectChanges();
      console.log('Current URL:', this.router.url);
    });
  }

  ngOnInit() {
    console.log('Current URL: ngOnInit', this.router.url);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('URL After Navigation:', event.url);
        if (event.url.includes('movie')) {
          this.selectedCategory = 'movie';
        } else if (event.url.includes('tv')) {
          this.selectedCategory = 'tv';
        } else if (event.url.includes('person')) {
          this.selectedCategory = 'person';
        }
      }
    });
    // Only check if there's a request_token in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const approvedToken = urlParams.get('request_token');

    if (approvedToken) {
      // If we're returning from TMDB, process the token
      this.tmdbAuthService.handleAuthFlow();
    }
  }

  searchTerm = '';
  selectedCategory: 'all' | 'movie' | 'tv' | 'person' = 'all';
  @Output() searchClicked = new EventEmitter<string>();
  @Output() categoryClicked = new EventEmitter<'all' | 'movie' | 'tv' | 'person'>();

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  onSearchClick() {
    console.log('Search term:', this.searchTerm, this.accountStore.searchTerm());
    this.accountStore.searchTerm.set(this.searchTerm);
  }

  onClearCheck() {
    if (!this.searchTerm) {
      this.onSearchClick();
    }
  }

  onCategoryClick(category: 'all' | 'movie' | 'tv' | 'person') {
    if (this.selectedCategory !== category) {
      this.selectedCategory = category;
      this.categoryClicked.emit(category);
    }
  }

  logout(): void {
    this.accountStore.clearAccountDetails(); // Call logout function from the store
  }

  login(): void {
    this.tmdbAuthService.handleAuthFlow();
  }
}
