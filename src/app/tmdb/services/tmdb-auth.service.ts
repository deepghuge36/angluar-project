import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TmdbService } from '../../tmdb.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class TmdbAuthService {
  constructor(
    private http: HttpClient,
    private tmdbService: TmdbService,
    private snackBar: MatSnackBar
  ) {}

  handleAuthFlow(): void {
    console.log('Checking for authentication token...');

    const urlParams = new URLSearchParams(window.location.search);
    const approvedToken = urlParams.get('request_token');
    const sessionId = localStorage.getItem('tmdb_session_id');

    if (sessionId) {
      console.log('Session ID already exists:', sessionId);
      this.tmdbService.fetchAccountId({ session_id: sessionId });
      return; // ✅ Exit if session already exists
    }

    // Check if we're returning from TMDB with an approved token
    if (approvedToken) {
      console.log('Approved token found:', approvedToken);
      this.createTmdbSession(approvedToken);
      return;
    }

    // If neither of the above conditions are met, start the new auth flow
    console.log('Starting new authentication flow...');
    this.requestTmdbAuthentication();
  }

  private createTmdbSession(approvedToken: string): void {
    this.tmdbService.createSession(approvedToken).subscribe(
      (res) => {
        console.log('Session created:', res);
        localStorage.setItem('tmdb_session_id', res.session_id);
        localStorage.removeItem('tmdb_auth_requested'); // Clear the request flag
        this.tmdbService.fetchAccountId({ session_id: res.session_id });
        window.history.replaceState({}, document.title, window.location.pathname);
      },
      (error) => {
        console.error('Error creating session:', error);
        this.showToast('Session creation failed. Try again.');
      }
    );
  }

  private requestTmdbAuthentication(): void {
    console.log('Starting TMDB authentication...');

    this.tmdbService.getRequestToken().subscribe((res) => {
      console.log('Request Token:', res.request_token);

      if (res.request_token) {
        localStorage.setItem('tmdb_auth_requested', 'true'); // ✅ Set flag before redirect
        window.location.href = `https://www.themoviedb.org/authenticate/${res.request_token}?redirect_to=${window.location.origin}`;
      } else {
        this.showToast('Failed to get authentication token. Try again.');
      }
    });
  }

  private showToast(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
