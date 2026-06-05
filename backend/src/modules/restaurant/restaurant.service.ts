import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface SearchNearbyRequest {
  lat: number;
  lng: number;
  keyword: string;
  radius?: number;
}

interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  distance: string;
  road_address_name: string;
  address_name: string;
  x: string;
  y: string;
  place_url: string;
}

interface KakaoKeywordResponse {
  documents: KakaoPlace[];
}

@Injectable()
export class RestaurantService {
  constructor(private readonly configService: ConfigService) {}

  async searchNearby(request: SearchNearbyRequest) {
    const apiKey = this.configService.get<string>('KAKAO_REST_API_KEY');

    if (!apiKey) {
      throw new ServiceUnavailableException(
        'KAKAO_REST_API_KEY is not configured.',
      );
    }

    const params = new URLSearchParams({
      query: request.keyword,
      x: String(request.lng),
      y: String(request.lat),
      radius: String(request.radius ?? 1000),
      size: '15',
      sort: 'distance',
      category_group_code: 'FD6',
    });

    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?${params.toString()}`,
      {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new ServiceUnavailableException(
        `Kakao Local request failed with status ${response.status}.`,
      );
    }

    const data = (await response.json()) as KakaoKeywordResponse;

    return data.documents.map((place) => ({
      id: place.id,
      name: place.place_name,
      category: place.category_name,
      distanceText: place.distance ? `${place.distance}m` : '',
      address: place.road_address_name || place.address_name,
      lat: Number(place.y),
      lng: Number(place.x),
      url: place.place_url,
      iconType: this.resolveIconType(place.place_name, place.category_name),
    }));
  }

  private resolveIconType(name: string, category: string) {
    const value = `${name} ${category}`;

    if (value.includes('치킨')) return 'chicken';
    if (value.includes('피자')) return 'pizza';
    if (value.includes('버거') || value.includes('햄버거')) return 'burger';
    if (value.includes('일식') || value.includes('이자카야')) return 'japanese';
    if (value.includes('중식') || value.includes('마라') || value.includes('양꼬치')) {
      return 'chinese';
    }
    if (value.includes('양식') || value.includes('스테이크') || value.includes('파스타')) {
      return 'western';
    }

    return 'restaurant';
  }
}
