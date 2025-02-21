// listing.component.ts
import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core'; //Import Input
import { TmdbService } from '../../tmdb.service';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Media } from '../../models/media.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-listing',
  standalone: true,
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class ListingComponent implements OnInit, AfterViewInit, OnChanges {
  mediaList: Media[] = [];
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;
  isLoading = false;
  @Input() selectedCategory: 'movie' | 'tv' | 'person' = 'movie'; // Default category
  @Input() search = ''; // Add this line to receive the search term

  private tmdbService = inject(TmdbService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // ✅ Reset list and fetch new data
  resetAndFetch(): void {
    this.currentPage = 1;
    this.mediaList = [];
    this.fetchMedia();
    this.search = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategory']) {
      console.log('Category changed:', changes['selectedCategory'].currentValue);
      this.resetAndFetch();
    }

    if (changes['search']) {
      console.log('Search query changed:', changes['search'].currentValue);
      this.resetAndFetch();
    }
  }

  ngOnInit(): void {
    this.fetchMedia();
  }

  ngAfterViewInit(): void {
    this.scrollContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
  }

  fetchMedia(): void {
    if (this.isLoading || this.currentPage > this.totalPages) return;

    this.isLoading = true;
    this.tmdbService.getTrending(this.selectedCategory, this.currentPage, this.search).subscribe(
      //Pass the search input
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

  changeCategory(category: 'movie' | 'tv' | 'person'): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.mediaList = []; // Clear previous data
    this.fetchMedia();
  }
}
