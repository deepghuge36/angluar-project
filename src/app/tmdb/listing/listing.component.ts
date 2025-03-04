import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  effect,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TmdbService } from '../../tmdb.service';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Media } from '../../models/media.model';
import { AccountStore } from '../store/tmdb.store';
import { TmdbAuthService } from '../services/tmdb-auth.service';

@Component({
  selector: 'app-listing',
  standalone: true,
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule, RouterModule],
})
export class ListingComponent implements OnInit, OnDestroy, AfterViewInit {
  mediaList: Media[] = [];
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;
  isLoading = false;
  search = '';
  selectedCategory: 'all' | 'movie' | 'tv' | 'person' = 'all';
  requestToken = '';
  accountDetails = computed(() => this.accountStore.accountDetails()); // Make it reactive
  isLogout = computed(() => sessionStorage.getItem('isLogout'));
  searchTerm = computed(() => this.accountStore.searchTerm());

  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tmdbService: TmdbService, // Inject TmdbService here
    private accountStore: AccountStore,
    private tmdbAuthService: TmdbAuthService
  ) {
    effect(() => {
      console.log('Account Details Updated:this.isLogout()', this.isLogout());

      console.log('Account Details Updated:', this.accountDetails());
      console.log('Account Details Updated: sessionStorage', sessionStorage.getItem('isLogout'));
      // Listen for searchTerm changes

      const term = this.searchTerm();
      console.log('Search term changed:', term);

      // Only update and fetch if search term actually changed
      if (term !== this.search) {
        this.search = term;
        if (term !== undefined) {
          this.resetAndFetch();
        }
      }
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit called', this.accountStore.searchTerm());

    // this.tmdbAuthService.handleAuthFlow();

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const category = params.get('category') as 'all' | 'movie' | 'tv' | 'person';
      console.log('Category changed:', category);
      if (category && this.selectedCategory !== category) {
        this.selectedCategory = category;
        this.resetAndFetch();
      }
    });

    this.fetchMedia();
  }

  fetchMedia(): void {
    console.log('Fetching media for:', this.selectedCategory);
    if (this.isLoading || this.currentPage > this.totalPages) return;

    this.isLoading = true;
    this.tmdbService.getTrending(this.selectedCategory, this.currentPage, this.search).subscribe(
      (response) => {
        console.log('Media fetched:', response);
        this.mediaList.push(...response.results);
        this.totalPages = response.total_pages;
        this.totalResults = response.total_results;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching media:', error);
        this.isLoading = false;
      }
    );
  }

  resetAndFetch(): void {
    console.log('Resetting and fetching new data...');
    this.currentPage = 1;
    this.mediaList = [];
    this.fetchMedia();
  }

  ngAfterViewInit(): void {
    console.log('After view init, adding scroll event listener');
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  onScroll(): void {
    const container = this.scrollContainer.nativeElement;
    const threshold = 200;

    if (
      container.scrollTop + container.clientHeight >= container.scrollHeight - threshold &&
      !this.isLoading
    ) {
      console.log('Scrolled to bottom, loading more data...');
      this.currentPage++;
      this.fetchMedia();
    }
  }

  setPlaceholder(event: Event) {
    console.log('triggered');

    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://placehold.co/300x450?text=No+Image'; // Online placeholder
  }

  ngOnDestroy(): void {
    console.log('Destroying component, cleaning up subscriptions');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
