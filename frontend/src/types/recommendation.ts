export type FoodCategory =
  | 'any'
  | 'korean'
  | 'western'
  | 'japanese'
  | 'chinese'
  | 'chicken'
  | 'pizza'
  | 'burger'

export type AlcoholType =
  | 'any'
  | 'soju'
  | 'beer'
  | 'makgeolli'
  | 'wine'
  | 'whiskey'
  | 'cocktail'

export interface LocationSummary {
  lat: number
  lng: number
  nx?: number
  ny?: number
}

export interface WeatherSummary {
  location: LocationSummary
  type: string
  temp: number
  humidity: number
  feelsLike: number
  source?: string
}

export interface Recommendation {
  food: string
  drink: string
  drinkBrand: string
  reason: string
  tags: string[]
  category: FoodCategory
  alcohol: AlcoholType
  searchKeyword: string
  alternatives: string[]
}

export interface Restaurant {
  id: string
  name: string
  category?: string
  address: string
  distanceText: string
  lat: number
  lng: number
  url?: string
  iconType?: string
}

export interface RecommendationResponse {
  weather: WeatherSummary
  recommendation: Recommendation
  restaurants: Restaurant[]
  restaurantsError?: string
  selection: {
    foodCategory: FoodCategory
    alcohol: AlcoholType
  }
}
