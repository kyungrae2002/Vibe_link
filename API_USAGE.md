# VibeLink API 사용 가이드

백엔드 서버와 통신하기 위한 API 클라이언트 사용 방법입니다.

## 설정

환경 변수 설정 (`.env` 파일):
```
VITE_API_BASE_URL=http://localhost:8080
```

## API 클라이언트 사용

### 1. 인증 (Authentication)

#### 로그인
```typescript
import { api } from './services/api';

// Spotify OAuth 로그인 페이지로 리다이렉트
api.auth.login();
```

#### 로그아웃
```typescript
const handleLogout = async () => {
  try {
    await api.auth.logout();
    console.log('로그아웃 성공');
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
};
```

#### 토큰 갱신
```typescript
// 자동으로 처리되지만 수동 호출도 가능
const refreshToken = async () => {
  try {
    await api.auth.refresh();
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
  }
};
```

### 2. 사용자 정보 (User)

#### 내 프로필 가져오기
```typescript
import { api } from './services/api';
import type { SpotifyUser } from './types/api';

const fetchProfile = async () => {
  try {
    const response = await api.user.getProfile();
    const user: SpotifyUser = response.data;
    console.log('사용자:', user.display_name);
  } catch (error) {
    console.error('프로필 가져오기 실패:', error);
  }
};
```

#### 내 Top Artists 가져오기
```typescript
import type { TopArtistsResponse } from './types/api';

const fetchTopArtists = async () => {
  try {
    const response = await api.user.getTopArtists({
      time_range: 'medium_term', // 'short_term', 'medium_term', 'long_term'
      limit: 20
    });
    const data: TopArtistsResponse = response.data;
    console.log('Top Artists:', data.items);
  } catch (error) {
    console.error('Top Artists 가져오기 실패:', error);
  }
};
```

#### 내 Top Tracks 가져오기
```typescript
import type { TopTracksResponse } from './types/api';

const fetchTopTracks = async () => {
  try {
    const response = await api.user.getTopTracks({
      time_range: 'medium_term',
      limit: 20
    });
    const data: TopTracksResponse = response.data;
    console.log('Top Tracks:', data.items);
  } catch (error) {
    console.error('Top Tracks 가져오기 실패:', error);
  }
};
```

#### 특정 사용자 프로필 가져오기
```typescript
const fetchUserProfile = async (userId: string) => {
  try {
    const response = await api.user.getUserProfile(userId);
    console.log('사용자 프로필:', response.data);
  } catch (error) {
    console.error('사용자 프로필 가져오기 실패:', error);
  }
};
```

### 3. 음악 취향 공유 (Preference)

#### 공유 링크 생성
```typescript
import type { CreateLinkResponse } from './types/api';

const createShareLink = async () => {
  try {
    const response = await api.preference.createLink();
    const data: CreateLinkResponse = response.data;
    console.log('공유 링크:', data.shareUrl);
    console.log('링크 ID:', data.linkId);
    return data;
  } catch (error) {
    console.error('링크 생성 실패:', error);
  }
};
```

#### 링크 정보 가져오기
```typescript
import type { PreferenceLinkDetails } from './types/api';

const getLinkDetails = async (linkId: string) => {
  try {
    const response = await api.preference.getLink(linkId);
    const data: PreferenceLinkDetails = response.data;
    console.log('링크 생성자:', data.userName);
    console.log('Top Artists 수:', data.topArtistsCount);
  } catch (error) {
    console.error('링크 정보 가져오기 실패:', error);
  }
};
```

#### 링크 수락 및 비교
```typescript
import type { AcceptLinkResponse } from './types/api';

const acceptLink = async (linkId: string) => {
  try {
    const response = await api.preference.acceptLink(linkId);
    const data: AcceptLinkResponse = response.data;

    console.log('매칭 퍼센트:', data.comparison.matchPercentage + '%');
    console.log('공통 아티스트 수:', data.comparison.commonCount);
    console.log('공통 아티스트:', data.comparison.commonArtists);
    console.log('상대방만의 아티스트:', data.comparison.uniqueToUser1);
    console.log('내 고유 아티스트:', data.comparison.uniqueToUser2);

    return data;
  } catch (error) {
    console.error('링크 수락 실패:', error);
  }
};
```

#### 내가 생성한 링크 목록
```typescript
import type { MyLinkItem } from './types/api';

const getMyLinks = async () => {
  try {
    const response = await api.preference.getMyLinks();
    const links: MyLinkItem[] = response.data;

    links.forEach(link => {
      console.log('링크 ID:', link.linkId);
      console.log('수락한 사람 수:', link.acceptedByCount);
      console.log('수락한 사람들:', link.acceptedBy);
    });
  } catch (error) {
    console.error('링크 목록 가져오기 실패:', error);
  }
};
```

### 4. 플레이리스트 (Playlist)

#### Blend 플레이리스트 생성
```typescript
import type { BlendPlaylistResponse } from './types/api';

const createBlendPlaylist = async (commonArtistIds: string[]) => {
  try {
    const response = await api.playlist.createBlend({
      commonArtistIds: commonArtistIds,
      playlistName: 'My VibeLink Blend',
      playlistDescription: 'Created with VibeLink'
    });

    const data: BlendPlaylistResponse = response.data;
    console.log('플레이리스트 생성됨:', data.playlist.name);
    console.log('Spotify URL:', data.playlist.url);
    console.log('트랙 수:', data.playlist.trackCount);

    return data;
  } catch (error) {
    console.error('플레이리스트 생성 실패:', error);
  }
};
```

#### 추천 트랙 가져오기
```typescript
import type { RecommendationsResponse } from './types/api';

const getRecommendations = async (artistIds: string[]) => {
  try {
    const response = await api.playlist.getRecommendations({
      seed_artists: artistIds.join(','),
      limit: 20
    });

    const data: RecommendationsResponse = response.data;
    console.log('추천 트랙:', data.tracks);
  } catch (error) {
    console.error('추천 가져오기 실패:', error);
  }
};
```

#### 내 플레이리스트 목록
```typescript
import type { PlaylistsResponse } from './types/api';

const getMyPlaylists = async () => {
  try {
    const response = await api.playlist.getMyPlaylists({ limit: 20 });
    const data: PlaylistsResponse = response.data;

    data.items.forEach(playlist => {
      console.log('플레이리스트:', playlist.name);
      console.log('트랙 수:', playlist.tracks.total);
    });
  } catch (error) {
    console.error('플레이리스트 목록 가져오기 실패:', error);
  }
};
```

#### 특정 플레이리스트 정보
```typescript
const getPlaylistDetails = async (playlistId: string) => {
  try {
    const response = await api.playlist.getPlaylist(playlistId);
    console.log('플레이리스트 정보:', response.data);
  } catch (error) {
    console.error('플레이리스트 정보 가져오기 실패:', error);
  }
};
```

### 5. 헬스 체크

```typescript
const checkHealth = async () => {
  try {
    const response = await api.health();
    console.log('서버 상태:', response.data);
  } catch (error) {
    console.error('서버 연결 실패:', error);
  }
};
```

## React 컴포넌트 사용 예시

```typescript
import { useState, useEffect } from 'react';
import { api } from './services/api';
import type { SpotifyUser, TopArtistsResponse } from './types/api';

function Dashboard() {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [topArtists, setTopArtists] = useState<TopArtistsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, artistsRes] = await Promise.all([
          api.user.getProfile(),
          api.user.getTopArtists({ time_range: 'medium_term', limit: 10 })
        ]);

        setUser(profileRes.data);
        setTopArtists(artistsRes.data);
      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>안녕하세요, {user?.display_name}!</h1>
      <h2>당신의 Top Artists</h2>
      <ul>
        {topArtists?.items.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 에러 처리

API 클라이언트는 자동으로 401 에러(인증 만료)를 처리하여 토큰을 갱신합니다.
갱신이 실패하면 자동으로 로그인 페이지로 리다이렉트됩니다.

```typescript
// 수동 에러 처리 예시
try {
  await api.user.getProfile();
} catch (error: any) {
  if (error.response?.status === 404) {
    console.error('리소스를 찾을 수 없습니다');
  } else if (error.response?.status === 500) {
    console.error('서버 오류가 발생했습니다');
  } else {
    console.error('알 수 없는 오류:', error.message);
  }
}
```

## 주의사항

1. 모든 API 호출은 세션 쿠키를 사용하므로 `withCredentials: true`가 설정되어 있습니다.
2. 백엔드 서버가 실행 중이어야 합니다 (기본: http://localhost:8080)
3. Spotify Developer Console에서 Redirect URI를 올바르게 설정해야 합니다.
4. 인증이 필요한 API는 로그인 후에만 호출할 수 있습니다.
