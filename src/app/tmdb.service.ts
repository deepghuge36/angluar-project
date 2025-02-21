import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Media {
  id: number;
  title?: string;
  name?: string; // For TV shows & people
  overview?: string;
  poster_path?: string;
  profile_path?: string; // For people
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  popularity: number;
  original_language?: string;
}

interface MediaResponse {
  page: number;
  results: Media[];
  total_pages: number;
  total_results: number;
}

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private baseUrl = `https://api.themoviedb.org/3`; // Updated base URL
  private apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTc4OWZhY2I3NTVlNWYyOGEwYWJlODk3ZDgxODZjYSIsIm5iZiI6MTcwNDAwNDkxMC45NTM5OTk4LCJzdWIiOiI2NTkxMGQyZTY1MWZjZjVmNjg4ZGVjNjkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.TbeTdOcdPMGM-_brDLI_WH2b-OtrKJV20jHnl-9nylc';

  constructor(private http: HttpClient) {}

  getTrending(type: 'movie' | 'tv' | 'person', page = 1, search = ''): Observable<MediaResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    });

    let url = '';

    if (search) {
      url = `${this.baseUrl}/search/${type}?language=en-US&page=${page}&query=${encodeURIComponent(search)}`;
    } else {
      url = `${this.baseUrl}/trending/${type}/day?language=en-US&page=${page}`;
    }

    return this.http.get<MediaResponse>(url, { headers });
  }
}
