import type {
  AlcoholType,
  FoodCategory,
  RecommendationResponse,
} from '../types/recommendation'

interface FetchRecommendationOptions {
  lat: number
  lng: number
  foodCategory: FoodCategory
  alcohol: AlcoholType
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:3000'

export async function fetchRecommendation({
  lat,
  lng,
  foodCategory,
  alcohol,
}: FetchRecommendationOptions): Promise<RecommendationResponse> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    foodCategory,
    alcohol,
  })

  const response = await fetch(`${API_BASE_URL}/api/recommendation?${params}`)

  if (!response.ok) {
    throw new Error(`추천 API 호출 실패: ${response.status}`)
  }

  return response.json()
}
