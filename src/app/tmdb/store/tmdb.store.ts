import { Injectable, signal } from '@angular/core';
import { AccountModel } from '../../models/media.model';

@Injectable({
  providedIn: 'root',
})
export class AccountStore {
  // Signal to store account details
  accountDetails = signal<AccountModel | null>(null);

  // Function to set account details (Login)
  setAccountDetails(details: AccountModel) {
    this.accountDetails.set({
      id: details.id,
      name: details.name,
      username: details.username,
      avatar: details.avatar,
      isApproved: details.isApproved ?? true,
      sessionId: details.sessionId ?? '',
      accountId: details.accountId ?? '',
    });
  }

  // Function to clear account details (Logout)
  clearAccountDetails() {
    this.accountDetails.update((data) => ({
      ...data,
      id: 0, // Ensure id is always defined
      isApproved: false,
      sessionId: '',
      accountId: '',
      name: '',
      username: '',
      avatar: '',
    }));
    localStorage.removeItem('tmdb_account');
    localStorage.removeItem('tmdb_session_id');
    sessionStorage.setItem('isLogout', 'true');
  }
}
