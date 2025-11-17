// Spotify API Response Types

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  country: string;
  product: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  popularity: number;
  followers: {
    total: number;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
}

export interface TopArtistsResponse {
  items: SpotifyArtist[];
}

export interface TopTracksResponse {
  items: SpotifyTrack[];
}

// Preference Link Types
export interface CreateLinkResponse {
  linkId: string;
  shareUrl: string;
  message: string;
}

export interface PreferenceLinkDetails {
  linkId: string;
  userName: string;
  userImage: string | null;
  createdAt: string;
  topArtistsCount: number;
}

export interface AcceptLinkResponse {
  message: string;
  comparison: ComparisonResult;
  originalUser: {
    id: string;
    name: string;
  };
  acceptingUser: {
    id: string;
    name: string;
  };
}

export interface ComparisonResult {
  commonArtists: SpotifyArtist[];
  commonCount: number;
  uniqueToUser1: SpotifyArtist[];
  uniqueToUser2: SpotifyArtist[];
  matchPercentage: string;
  totalUser1Artists: number;
  totalUser2Artists: number;
}

export interface MyLinkItem {
  linkId: string;
  createdAt: string;
  acceptedByCount: number;
  acceptedBy: Array<{
    userId: string;
    userName: string;
    acceptedAt: string;
  }>;
}

// Playlist Types
export interface CreateBlendRequest {
  commonArtistIds: string[];
  playlistName?: string;
  playlistDescription?: string;
}

export interface BlendPlaylistResponse {
  message: string;
  playlist: {
    id: string;
    name: string;
    url: string;
    trackCount: number;
  };
}

export interface RecommendationsResponse {
  tracks: SpotifyTrack[];
  seeds: Array<{
    id: string;
    type: string;
  }>;
}

export interface PlaylistsResponse {
  items: Array<{
    id: string;
    name: string;
    description: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
    tracks: {
      total: number;
    };
    external_urls: {
      spotify: string;
    };
  }>;
}
