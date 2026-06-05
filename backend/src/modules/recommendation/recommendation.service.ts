import { Injectable } from '@nestjs/common';
import { RestaurantService } from '../restaurant/restaurant.service';
import { WeatherService } from '../weather/weather.service';
import { WeatherSnapshot } from '../weather/weather.types';
import {
  ALCOHOL_BRANDS,
  AlcoholBrand,
  AlcoholType,
  FoodCategory,
  FoodMenu,
  FOOD_MENUS,
} from './recommendation-data';
import { RecommendationResult } from './recommendation.types';

interface RecommendationRequest {
  lat: number;
  lng: number;
  alcohol?: string;
  foodCategory?: string;
}

interface ScoredFood {
  food: FoodMenu;
  score: number;
}

@Injectable()
export class RecommendationService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly restaurantService: RestaurantService,
  ) {}

  async getRecommendation(request: RecommendationRequest) {
    const weather = await this.weatherService.getCurrentWeather(
      request.lat,
      request.lng,
    );
    const foodCategory = this.normalizeFoodCategory(request.foodCategory);
    const alcohol = this.normalizeAlcohol(request.alcohol);
    const recommendation = this.pickRecommendation(
      weather,
      foodCategory,
      alcohol,
    );
    const restaurantResult = await this.getRestaurantsSafely(
      request.lat,
      request.lng,
      recommendation.searchKeyword,
    );

    return {
      weather,
      recommendation,
      restaurants: restaurantResult.restaurants,
      restaurantsError: restaurantResult.error,
      selection: {
        foodCategory,
        alcohol,
      },
    };
  }

  private async getRestaurantsSafely(lat: number, lng: number, keyword: string) {
    try {
      const restaurants = await this.restaurantService.searchNearby({
        lat,
        lng,
        keyword,
        radius: 1000,
      });

      return { restaurants };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Restaurant search failed.';
      return {
        restaurants: [],
        error: message,
      };
    }
  }

  private pickRecommendation(
    weather: WeatherSnapshot,
    foodCategory: FoodCategory,
    requestedAlcohol: AlcoholType,
  ): RecommendationResult {
    const scoredFoods = FOOD_MENUS.map((food) => ({
      food,
      score: this.scoreFood(food, weather, foodCategory, requestedAlcohol),
    }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    const shortlist = this.getWeightedShortlist(scoredFoods);
    const selectedFood = this.pickRandom(shortlist).food;
    const alcoholType = this.pickAlcoholType(selectedFood, requestedAlcohol);
    const alcoholBrand = this.pickAlcoholBrand(alcoholType, selectedFood);
    const searchKeyword = this.pickRandom(selectedFood.searchKeywords);

    return {
      food: selectedFood.name,
      drink: alcoholBrand.label,
      drinkBrand: alcoholBrand.brand,
      reason: this.buildReason(weather, selectedFood, alcoholBrand),
      tags: selectedFood.tags,
      category: selectedFood.category,
      alcohol: alcoholType,
      searchKeyword,
      alternatives: shortlist
        .filter((item) => item.food.name !== selectedFood.name)
        .slice(0, 3)
        .map((item) => item.food.name),
    };
  }

  private scoreFood(
    food: FoodMenu,
    weather: WeatherSnapshot,
    foodCategory: FoodCategory,
    requestedAlcohol: AlcoholType,
  ) {
    let score = 10;

    if (foodCategory !== 'any') {
      score += food.category === foodCategory ? 45 : -35;
    }

    if (requestedAlcohol !== 'any') {
      score += food.alcoholMatches.includes(requestedAlcohol) ? 35 : -25;
    }

    if (
      food.weatherMatches.includes(weather.type) ||
      food.weatherMatches.includes('Any')
    ) {
      score += 25;
    }

    if (food.tempMin !== undefined && weather.temp >= food.tempMin) {
      score += 10;
    }

    if (food.tempMax !== undefined && weather.temp <= food.tempMax) {
      score += 10;
    }

    if (weather.type === 'Rain' && food.tags.some((tag) => ['rainy', 'spicy', 'soup', 'fried'].includes(tag))) {
      score += 12;
    }

    if (weather.temp <= 5 && food.tags.some((tag) => ['soup', 'warm', 'heavy', 'spicy'].includes(tag))) {
      score += 12;
    }

    if (weather.temp >= 28 && food.tags.some((tag) => ['light', 'fresh', 'seafood'].includes(tag))) {
      score += 12;
    }

    return score;
  }

  private getWeightedShortlist(scoredFoods: ScoredFood[]) {
    const positiveFoods = scoredFoods.length > 0 ? scoredFoods : FOOD_MENUS.map((food) => ({ food, score: 1 }));
    const topScore = positiveFoods[0]?.score ?? 1;
    const shortlist = positiveFoods.filter((item) => item.score >= topScore - 20);

    return shortlist.length > 0 ? shortlist.slice(0, 8) : positiveFoods.slice(0, 8);
  }

  private pickAlcoholType(food: FoodMenu, requestedAlcohol: AlcoholType) {
    if (requestedAlcohol !== 'any' && food.alcoholMatches.includes(requestedAlcohol)) {
      return requestedAlcohol;
    }

    return this.pickRandom(food.alcoholMatches);
  }

  private pickAlcoholBrand(alcoholType: AlcoholType, food: FoodMenu) {
    const alcohol =
      ALCOHOL_BRANDS.find((item) => item.type === alcoholType) ??
      ALCOHOL_BRANDS[0];
    const brandPool = alcohol.brands;

    return {
      label: alcohol.label,
      brand: this.pickRandom(brandPool),
      type: alcohol.type,
      matchTags: alcohol.matchTags.filter((tag) => food.tags.includes(tag)),
    };
  }

  private buildReason(
    weather: WeatherSnapshot,
    food: FoodMenu,
    alcohol: Pick<AlcoholBrand, 'label' | 'type'> & { brand: string },
  ) {
    const weatherText =
      weather.type === 'Rain'
        ? '비 오는 날씨'
        : weather.type === 'Snow'
          ? '눈 오는 날씨'
          : weather.temp <= 5
            ? '쌀쌀한 날씨'
            : weather.temp >= 28
              ? '더운 날씨'
              : '오늘 날씨';

    return `${weatherText}와 선택한 취향을 기준으로 ${food.name}에 ${alcohol.brand} ${alcohol.label} 조합을 추천합니다.`;
  }

  private normalizeFoodCategory(value?: string): FoodCategory {
    const allowed: FoodCategory[] = [
      'any',
      'korean',
      'western',
      'japanese',
      'chinese',
      'chicken',
      'pizza',
      'burger',
    ];
    return allowed.includes(value as FoodCategory)
      ? (value as FoodCategory)
      : 'any';
  }

  private normalizeAlcohol(value?: string): AlcoholType {
    const allowed: AlcoholType[] = [
      'any',
      'soju',
      'beer',
      'makgeolli',
      'wine',
      'whiskey',
      'cocktail',
    ];
    return allowed.includes(value as AlcoholType)
      ? (value as AlcoholType)
      : 'any';
  }

  private pickRandom<T>(items: T[]) {
    return items[Math.floor(Math.random() * items.length)];
  }
}
