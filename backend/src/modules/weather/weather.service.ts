import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherSnapshot, WeatherType } from './weather.types';

interface KmaItem {
  category: string;
  obsrValue: string;
}

interface KmaResponse {
  response?: {
    header?: {
      resultCode?: string;
      resultMsg?: string;
    };
    body?: {
      items?: {
        item?: KmaItem[];
      };
    };
  };
}

@Injectable()
export class WeatherService {
  constructor(private readonly configService: ConfigService) {}

  async getCurrentWeather(lat: number, lng: number): Promise<WeatherSnapshot> {
    const serviceKey = this.configService.get<string>('KMA_SERVICE_KEY');

    if (!serviceKey) {
      throw new ServiceUnavailableException('KMA_SERVICE_KEY is not configured.');
    }

    const grid = this.toKmaGrid(lat, lng);
    const base = this.getUltraShortBaseTime();
    const params = new URLSearchParams({
      pageNo: '1',
      numOfRows: '20',
      dataType: 'JSON',
      base_date: base.date,
      base_time: base.time,
      nx: String(grid.nx),
      ny: String(grid.ny),
    });

    const normalizedKey = this.normalizeServiceKey(serviceKey);
    const url =
      'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst' +
      `?serviceKey=${encodeURIComponent(normalizedKey)}&${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new ServiceUnavailableException(
        `KMA request failed with status ${response.status}.`,
      );
    }

    const data = (await response.json()) as KmaResponse;
    const header = data.response?.header;

    if (header?.resultCode !== '00') {
      throw new ServiceUnavailableException(
        `KMA request failed: ${header?.resultMsg ?? 'unknown error'}`,
      );
    }

    const items = data.response?.body?.items?.item ?? [];
    const values = this.indexItems(items);
    const temp = this.toNumber(values.T1H, 0);
    const humidity = this.toNumber(values.REH, 0);
    const precipitationType = values.PTY ?? '0';

    return {
      location: {
        lat,
        lng,
        nx: grid.nx,
        ny: grid.ny,
      },
      type: this.resolveWeatherType(temp, precipitationType),
      temp,
      humidity,
      feelsLike: temp,
      precipitationType,
      source: 'KMA',
    };
  }

  private indexItems(items: KmaItem[]) {
    return items.reduce<Record<string, string>>((acc, item) => {
      acc[item.category] = item.obsrValue;
      return acc;
    }, {});
  }

  private resolveWeatherType(temp: number, precipitationType: string): WeatherType {
    if (['1', '5', '6'].includes(precipitationType)) {
      return 'Rain';
    }

    if (['2', '3', '7'].includes(precipitationType)) {
      return 'Snow';
    }

    if (temp <= 5) {
      return 'Cold';
    }

    if (temp >= 28) {
      return 'Hot';
    }

    return 'Clear';
  }

  private toNumber(value: string | undefined, fallback: number) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private normalizeServiceKey(serviceKey: string) {
    try {
      return decodeURIComponent(serviceKey);
    } catch {
      return serviceKey;
    }
  }

  private getUltraShortBaseTime() {
    const now = new Date();
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    if (kst.getUTCMinutes() < 45) {
      kst.setUTCHours(kst.getUTCHours() - 1);
    }

    const year = kst.getUTCFullYear();
    const month = String(kst.getUTCMonth() + 1).padStart(2, '0');
    const date = String(kst.getUTCDate()).padStart(2, '0');
    const hour = String(kst.getUTCHours()).padStart(2, '0');

    return {
      date: `${year}${month}${date}`,
      time: `${hour}00`,
    };
  }

  private toKmaGrid(lat: number, lng: number) {
    const re = 6371.00877;
    const grid = 5.0;
    const slat1 = 30.0;
    const slat2 = 60.0;
    const olon = 126.0;
    const olat = 38.0;
    const xo = 43;
    const yo = 136;
    const degrad = Math.PI / 180.0;

    const reGrid = re / grid;
    const slat1Rad = slat1 * degrad;
    const slat2Rad = slat2 * degrad;
    const olonRad = olon * degrad;
    const olatRad = olat * degrad;

    let sn =
      Math.tan(Math.PI * 0.25 + slat2Rad * 0.5) /
      Math.tan(Math.PI * 0.25 + slat1Rad * 0.5);
    sn = Math.log(Math.cos(slat1Rad) / Math.cos(slat2Rad)) / Math.log(sn);

    let sf = Math.tan(Math.PI * 0.25 + slat1Rad * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1Rad)) / sn;

    let ro = Math.tan(Math.PI * 0.25 + olatRad * 0.5);
    ro = (reGrid * sf) / Math.pow(ro, sn);

    let ra = Math.tan(Math.PI * 0.25 + lat * degrad * 0.5);
    ra = (reGrid * sf) / Math.pow(ra, sn);

    let theta = lng * degrad - olonRad;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;

    return {
      nx: Math.floor(ra * Math.sin(theta) + xo + 0.5),
      ny: Math.floor(ro - ra * Math.cos(theta) + yo + 0.5),
    };
  }
}
