import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../tmdb.service';
import { CommonModule } from '@angular/common';
import { Media } from '../../models/media.model';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss',
})
export class PersonComponent implements OnInit {
  personId: string | null = null;
  person: Media | null = null;
  isLoading = false;
  isError = false;

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService
  ) {}

  ngOnInit() {
    this.personId = this.route.snapshot.paramMap.get('id');
    console.log('Person ID:', this.personId);

    if (this.personId) {
      this.isLoading = true;
      this.isError = false;

      this.tmdbService.getDetail('person', this.personId).subscribe({
        next: (data) => {
          this.person = { ...data, id: this.personId ? +this.personId : 0 };
          console.log('Person Details:', this.person);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching person:', err);
          this.isError = true;
          this.isLoading = false;
        },
      });
    }
  }
}
