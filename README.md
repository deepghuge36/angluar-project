# Angular TMDB Project

This is an Angular v19 project built on the TMDB service API. The application allows users to search for movies, TV shows, and people dynamically with features like infinite loading, routing, and state management using Angular Signals and NgRx Store.

## Live Demo

[View the live project](https://angluar-project.vercel.app/)

## Features

- **Dynamic Search**: Search for movies, TV shows, and people using the TMDB API.
- **Routing**: Implemented Angular Router for navigation.
- **Infinite Loading**: Seamless pagination with infinite scroll.
- **State Management**: Utilized Angular Signals and NgRx Store to share state across listing and detail components.
- **Deployment on Vercel**: Hosted with Vercel for fast and reliable performance.
- **Vercel Analytics**: Integrated [Vercel Speed Insights](https://vercel.com/docs/speed-insights) and [Vercel Web Analytics](https://vercel.com/docs/analytics) for performance tracking.
- **Husky & Linting**: Configured Husky for Git hooks and set up ESLint & Prettier for code quality enforcement.

## Tech Stack

- **Angular v19**
- **Angular Material** (UI Components)
- **NgRx Store & Signals** (State Management)
- **TMDB API** (Movie Data Source)
- **Vercel** (Deployment & Analytics)
- **Husky & Linting** (Code Quality)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/deepghuge36/angluar-project.git
   cd angluar-project
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add your TMDB API Key:
     ```env
     TMDB_API_KEY=your_tmdb_api_key
     ```
4. Run the development server:
   ```sh
   npm start
   ```
5. Open the project in your browser:
   ```sh
   http://localhost:4200
   ```

## Scripts

- `npm start` – Start the development server.
- `npm run build` – Build the project.
- `npm run test` – Run tests.
- `npm run lint` – Lint the project.
- `npm run format` – Format code with Prettier.
- `npm run prepare` – Set up Husky Git hooks.

## Folder Structure

```
/src
  ├── app/
  │   ├── app.module.ts        # Root module
  │   ├── app.component.ts     # Root component
  │   ├── app.routing.module.ts # Root routing module
  │   ├── models/              # Data models
  │   ├── tmdb/
  │   │   ├── components/      # Reusable components
  │   │   ├── pages/           # Page components
  │   │   ├── services/        # API services
  │   │   ├── store/           # State management
  ├── assets/                  # Static assets
  ├── environments/            # Environment configuration
```

## Contributions

Feel free to fork this repository and submit pull requests. Any contributions are welcome!

## License

This project is licensed under the MIT License.
