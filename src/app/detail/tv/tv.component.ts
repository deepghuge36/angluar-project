import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../tmdb.service';
import { Media } from '../../models/media.model';
import { CommonModule } from '@angular/common';

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

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService
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
}
