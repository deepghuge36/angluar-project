import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListingComponent } from './tmdb/listing/listing.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListingComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'test';
}
