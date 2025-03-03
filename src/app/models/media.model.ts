export interface Media {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  popularity?: number;
  original_language?: string;
  profile_path?: string;
  media_type?: string;
  known_for_department?: string;
  birthday?: string;
  deathday?: string;
  biography?: string;
  genres?: { id: number; name: string }[];
  runtime?: string;
  backdrop_path?: string;
}

export interface AccountModel {
  id: number;
  name: string;
  username: string;
  avatar: string;
  isApproved: boolean;
  sessionId: string;
  accountId: string;
}
