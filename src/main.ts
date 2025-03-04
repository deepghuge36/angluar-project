import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { inject } from '@vercel/analytics';

inject();
injectSpeedInsights();
bootstrapApplication(AppComponent, { providers: appConfig.providers }).catch((err) =>
  console.error(err)
);

console.log('husky test');
