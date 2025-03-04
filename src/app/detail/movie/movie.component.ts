import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService, VideoResponse } from '../../tmdb.service';
import { CommonModule } from '@angular/common';
import { Media } from '../../models/media.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss',
})
export class MovieComponent implements OnInit {
  movieId: string | null = null;
  movie: Media | null = null;
  isLoading = false;
  isError = false;
  genres = 'N/A';
  videos: VideoResponse[] = [];
  selectedVideo: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('id');
    console.log('Movie ID:', this.movieId);

    if (this.movieId) {
      this.isLoading = true;
      this.isError = false;
      this.tmdbService.getDetail('movie', this.movieId).subscribe({
        next: (data) => {
          this.movie = { ...data, id: this.movieId ? +this.movieId : 0 };
          this.genres = this.movie.genres?.map((g) => g?.name).join(', ') || 'N/A';
          console.log('Movie Details:', this.movie);
          this.getVideos();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching movie:', err);
          this.isError = true;
          this.isLoading = false;
        },
      });
    }
  }
  getVideos() {
    if (this.movie) {
      this.tmdbService.getVideos('movie', this.movie.id.toString()).subscribe({
        next: (videoResponse) => {
          console.log('Video Response:', videoResponse);

          this.videos.push(videoResponse);
        },
        error: (err) => {
          console.error('Error fetching videos:', err);
        },
      });
    }
    return null;
  }

  selectVideo(videoKey: string) {
    this.selectedVideo = videoKey;
  }
  closeVideo() {
    this.selectedVideo = null;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeVideo();
    }
  }
}
