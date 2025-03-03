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
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit called');

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

  // handleAuthToken(): void {
  //   console.log('Checking for authentication token...');
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const approvedToken = urlParams.get('request_token');

  //   if (approvedToken && !localStorage.getItem('tmdb_session_id')) {
  //     console.log('Approved token found:', approvedToken);
  //     this.tmdbService.createSession(approvedToken).subscribe(
  //       (res) => {
  //         console.log('Session created:', res);
  //         localStorage.setItem('tmdb_session_id', res.session_id);
  //         this.tmdbService.fetchAccountId({ session_id: res.session_id });
  //         window.history.replaceState({}, document.title, window.location.pathname);
  //       },
  //       (error) => {
  //         console.error('Error creating session:', error);
  //       }
  //     );
  //   } else {
  //     this.startTmdbAuthentication();
  //   }
  // }

  // startTmdbAuthentication(): void {
  //   console.log('Starting TMDB authentication...', localStorage.getItem('isApproved'));
  //   if (!localStorage.getItem('tmdb_session_id')) {
  //     this.tmdbService.getRequestToken().subscribe((res) => {
  //       console.log('Request Token:', res.request_token);
  //       window.location.href = `https://www.themoviedb.org/authenticate/${res.request_token}?redirect_to=${window.location.origin}`;
  //     });
  //   } else {
  //     this.tmdbService.fetchAccountId({ session_id: localStorage.getItem('tmdb_session_id')! });
  //     console.log('Session ID already exists:', localStorage.getItem('tmdb_session_id'));
  //   }
  // }

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
