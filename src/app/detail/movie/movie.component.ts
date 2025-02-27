import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../tmdb.service';
import { CommonModule } from '@angular/common';
import { Media } from '../../models/media.model';

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
  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService
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
}
