import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService, VideoResponse } from '../../tmdb.service';
import { Media } from '../../models/media.model';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tv.component.html',
  styleUrl: './tv.component.scss',
})
export class TvComponent implements OnInit {
  tvId: string | null = null;
  tvShow: Media | null = null;
  isLoading = false;
  isError = false;
  videos: VideoResponse[] = [];
  selectedVideo: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.tvId = this.route.snapshot.paramMap.get('id');
    console.log('TV Show ID:', this.tvId);

    if (this.tvId) {
      this.isLoading = true;
      this.isError = false;

      this.tmdbService.getDetail('tv', this.tvId).subscribe({
        next: (data) => {
          this.tvShow = { ...data, id: this.tvId ? +this.tvId : 0 };
          console.log('TV Show Details:', this.tvShow);
          this.getVideos();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching TV Show:', err);
          this.isError = true;
          this.isLoading = false;
        },
      });
    }
  }

  getVideos() {
    if (this.tvShow) {
      this.tmdbService.getVideos('tv', this.tvShow.id.toString()).subscribe({
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
