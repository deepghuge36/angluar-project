// ListingComponent

import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TmdbService } from '../../tmdb.service';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Media } from '../../models/media.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-listing',
  standalone: true,
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule, RouterLink],
})
export class ListingComponent implements OnInit, AfterViewInit, OnChanges {
  mediaList: Media[] = [];
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;
  isLoading = false;
  search = ''; // Add this line to receive the search term
  selectedCategory: 'all' | 'movie' | 'tv' | 'person' = 'all'; // Default category

  private tmdbService = inject(TmdbService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Watch for route changes
    this.route.paramMap.subscribe((params) => {
      const category = params.get('category') as 'all' | 'movie' | 'tv' | 'person';
      if (category && this.selectedCategory !== category) {
        this.selectedCategory = category;
        this.resetAndFetch();
      }
    });

    this.fetchMedia();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['search'] && !changes['search'].firstChange) {
      console.log('Search query changed:', changes['search'].currentValue);
      this.resetAndFetch();
    }
  }

  ngAfterViewInit(): void {
    this.scrollContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
  }

  fetchMedia(): void {
    console.log('Fetching media for:', this.selectedCategory);
    if (this.isLoading || this.currentPage > this.totalPages) return;

    this.isLoading = true;
    this.tmdbService.getTrending(this.selectedCategory, this.currentPage, this.search).subscribe(
      (response) => {
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
    this.currentPage = 1;
    this.mediaList = [];
    this.fetchMedia();
  }

  onScroll(): void {
    const container = this.scrollContainer.nativeElement;
    const threshold = 200;

    if (
      container.scrollTop + container.clientHeight >= container.scrollHeight - threshold &&
      !this.isLoading
    ) {
      this.currentPage++;
      this.fetchMedia();
    }
  }

  onPageChange(event: { pageIndex: number }): void {
    this.currentPage = event.pageIndex + 1;
    this.mediaList = [];
    this.fetchMedia();
  }

  changeCategory(category: 'all' | 'movie' | 'tv' | 'person'): void {
    if (this.selectedCategory !== category) {
      this.router.navigate(['/listing', category]); // Navigate to the new category
    }
  }

  logFunction(item: Media): void {
    console.log(item);
  }
}
