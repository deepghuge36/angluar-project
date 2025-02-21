import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TmdbService } from '../../tmdb.service';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Media } from '../../models/media.model';

@Component({
  selector: 'app-listing',
  standalone: true,
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
  imports: [CommonModule],
})
export class ListingComponent implements OnInit, AfterViewInit {
  mediaList: Media[] = [];
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;
  isLoading = false;
  selectedCategory: 'movie' | 'tv' | 'person' = 'movie'; // Default category

  private tmdbService = inject(TmdbService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  ngOnInit(): void {
    this.fetchMedia();
  }

  ngAfterViewInit(): void {
    this.scrollContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
  }

  fetchMedia(): void {
    if (this.isLoading || this.currentPage > this.totalPages) return;

    this.isLoading = true;
    this.tmdbService.getTrending(this.selectedCategory, this.currentPage).subscribe(
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
