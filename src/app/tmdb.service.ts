import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Media } from './models/media.model';
import { AccountStore } from './tmdb/store/tmdb.store';

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
  private accountId = 0;
  private sessionId = ``;

  constructor(
    private http: HttpClient,
    private accountStore: AccountStore
  ) {}
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    });
  }

  getRequestToken(): Observable<{ request_token: string }> {
    const url = `${this.baseUrl}/authentication/token/new`;
    return this.http.get<{ request_token: string }>(url, { headers: this.getHeaders() });
  }

  createSession(requestToken: string): Observable<{ session_id: string; success: boolean }> {
    const url = `${this.baseUrl}/authentication/session/new`;
    return this.http.post<{ session_id: string; success: boolean }>(
      url,
      { request_token: requestToken },
      { headers: this.getHeaders() }
    );
  }

  // Step 1: Fetch Account ID
  fetchAccountId({ session_id }: { session_id: string }): void {
    const url = `${this.baseUrl}/account?session_id=${session_id}`;

    this.http
      .get<{
        id: string;
        name: string;
        username: string;
        avatar: { gravatar: { hash: string } };
      }>(url, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          console.log('Fetched Account ID:', res.id);
          localStorage.setItem('tmdb_account', JSON.stringify(res));

          this.accountStore.setAccountDetails({
            ...this.accountStore.accountDetails(),
            id: Number(res.id) || 0,
            name: res.name,
            username: res.username,
            avatar: res.avatar.gravatar.hash,
            isApproved: this.accountStore?.accountDetails()?.isApproved ?? true, // Default to false if undefined
            sessionId: this.accountStore?.accountDetails()?.sessionId ?? '', // Default empty string
            accountId: res?.id ?? this.accountStore?.accountDetails()?.id ?? '', // Default empty string
          });
        },
        error: (error) => {
          console.error('Error fetching account ID:', error);
        },
      });
  }

  getTrending(
    type: 'all' | 'movie' | 'tv' | 'person',
    page = 1,
    search = ''
  ): Observable<MediaResponse> {
    let url = '';

    if (search) {
      url = `${this.baseUrl}/search/${type}?language=en-US&page=${page}&query=${encodeURIComponent(search)}`;
    } else {
      url = `${this.baseUrl}/trending/${type}/day?language=en-US&page=${page}`;
    }

    return this.http.get<MediaResponse>(url, { headers: this.getHeaders() });
  }

  getDetail(type: 'movie' | 'tv' | 'person', id: string): Observable<MediaResponse> {
    let url = '';
    if (type === 'movie') {
      url = `${this.baseUrl}/movie/${id}`;
    }

    if (type === 'tv') {
      url = `${this.baseUrl}/tv/${id}`;
    }
    if (type === 'person') {
      url = `${this.baseUrl}/person/${id}`;
    }

    return this.http.get<MediaResponse>(url, { headers: this.getHeaders() });
  }
}
