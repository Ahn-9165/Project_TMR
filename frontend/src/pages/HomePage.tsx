import { useEffect, useState } from 'react'
import { fetchRecommendation } from '../api/recommendationApi'
import { KakaoRestaurantMap } from '../components/KakaoRestaurantMap'
import { RecommendationLoadingOverlay } from '../components/RecommendationLoadingOverlay'
import type {
  AlcoholType,
  FoodCategory,
  LocationSummary,
  RecommendationResponse,
} from '../types/recommendation'

const DEFAULT_LOCATION: LocationSummary = {
  lat: 37.5665,
  lng: 126.978,
}

const MIN_LOADING_MS = 2200

const foodOptions: Array<{ value: FoodCategory; label: string }> = [
  { value: 'any', label: '전체' },
  { value: 'korean', label: '한식' },
  { value: 'western', label: '양식' },
  { value: 'japanese', label: '일식' },
  { value: 'chinese', label: '중식' },
  { value: 'chicken', label: '치킨' },
  { value: 'pizza', label: '피자' },
  { value: 'burger', label: '버거' },
]

const alcoholOptions: Array<{ value: AlcoholType; label: string }> = [
  { value: 'any', label: '전체' },
  { value: 'soju', label: '소주' },
  { value: 'beer', label: '맥주' },
  { value: 'makgeolli', label: '막걸리' },
  { value: 'wine', label: '와인' },
  { value: 'whiskey', label: '양주' },
  { value: 'cocktail', label: '칵테일' },
]

export function HomePage() {
  const [data, setData] = useState<RecommendationResponse | null>(null)
  const [location, setLocation] = useState<LocationSummary>(DEFAULT_LOCATION)
  const [foodCategory, setFoodCategory] = useState<FoodCategory>('any')
  const [alcohol, setAlcohol] = useState<AlcoholType>('any')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadRecommendation = async (
    nextLocation = location,
    nextFoodCategory = foodCategory,
    nextAlcohol = alcohol,
  ) => {
    const startedAt = Date.now()
    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchRecommendation({
        lat: nextLocation.lat,
        lng: nextLocation.lng,
        foodCategory: nextFoodCategory,
        alcohol: nextAlcohol,
      })
      await waitRemainingTime(startedAt)
      setData(result)
    } catch (err) {
      await waitRemainingTime(startedAt)
      setError(err instanceof Error ? err.message : '추천을 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const requestLocationRecommendation = () => {
    if (!navigator.geolocation) {
      setLocation(DEFAULT_LOCATION)
      void loadRecommendation(DEFAULT_LOCATION)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setLocation(nextLocation)
        void loadRecommendation(nextLocation)
      },
      () => {
        setLocation(DEFAULT_LOCATION)
        void loadRecommendation(DEFAULT_LOCATION)
      },
      {
        enableHighAccuracy: true,
        timeout: 7000,
      },
    )
  }

  const handleFoodCategoryChange = (value: FoodCategory) => {
    setFoodCategory(value)
    void loadRecommendation(location, value, alcohol)
  }

  const handleAlcoholChange = (value: AlcoholType) => {
    setAlcohol(value)
    void loadRecommendation(location, foodCategory, value)
  }

  useEffect(() => {
    requestLocationRecommendation()
  }, [])

  return (
    <div className="app-shell">
      {isLoading ? <RecommendationLoadingOverlay /> : null}

      <header className="topbar">
        <div className="brand">
          <strong>Project TMR</strong>
          <span>음식 카테고리와 주종으로 고르는 오늘의 안주 :)</span>
        </div>
        <button
          className="location-button"
          type="button"
          onClick={requestLocationRecommendation}
          disabled={isLoading}
        >
          {isLoading ? '추천 중' : '위치로 다시 추천'}
        </button>
      </header>

      <section className="selector-panel">
        <ChoiceGroup
          label="음식 메뉴"
          options={foodOptions}
          value={foodCategory}
          onChange={handleFoodCategoryChange}
        />
        <ChoiceGroup
          label="술 주종"
          options={alcoholOptions}
          value={alcohol}
          onChange={handleAlcoholChange}
        />
      </section>

      {error ? <div className="notice">{error}</div> : null}
      {data?.restaurantsError ? (
        <div className="notice subtle">
          음식점 API 연결을 확인해야 합니다. 날씨 추천은 정상 표시 중입니다.
        </div>
      ) : null}

      {data ? (
        <main className="main-grid">
          <section className="hero-panel">
            <div className="weather-line">
              <span className="weather-badge">{data.weather.type}</span>
              <span>
                {data.weather.temp}도, 체감 {data.weather.feelsLike}도
              </span>
            </div>
            <h1>
              오늘은 {data.recommendation.food}에{' '}
              {data.recommendation.drinkBrand}
            </h1>
            <p className="reason">{data.recommendation.reason}</p>

            <div className="recommendation-pair">
              <div className="pair-card">
                <span>추천 안주</span>
                <strong>{data.recommendation.food}</strong>
              </div>
              <div className="pair-card">
                <span>어울리는 술</span>
                <strong>{data.recommendation.drinkBrand}</strong>
                <em>{data.recommendation.drink}</em>
              </div>
            </div>

            <div className="tag-row">
              {data.recommendation.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>

            {data.recommendation.alternatives.length > 0 ? (
              <div className="alternative-row">
                <span>다른 추천</span>
                {data.recommendation.alternatives.map((item) => (
                  <strong key={item}>{item}</strong>
                ))}
              </div>
            ) : null}
          </section>

          <aside className="side-panel">
            <h2>현재 날씨</h2>
            <ul className="metric-list">
              <li>
                <span>기온</span>
                <strong>{data.weather.temp}도</strong>
              </li>
              <li>
                <span>체감</span>
                <strong>{data.weather.feelsLike}도</strong>
              </li>
              <li>
                <span>습도</span>
                <strong>{data.weather.humidity}%</strong>
              </li>
            </ul>
          </aside>

          <section className="map-panel">
            <div className="panel-title">
              <h2>1km 주변 음식점</h2>
              <span>{data.restaurants.length}곳</span>
            </div>
            <KakaoRestaurantMap
              location={data.weather.location ?? location}
              restaurants={data.restaurants}
            />
          </section>

          <section className="list-panel">
            <h2>근처 음식점</h2>
            {data.restaurants.length > 0 ? (
              <ul className="restaurant-list">
                {data.restaurants.map((restaurant) => (
                  <li key={restaurant.id}>
                    <div className="restaurant-info">
                      <strong>{restaurant.name}</strong>
                      <span>{restaurant.address}</span>
                    </div>
                    {restaurant.url ? (
                      <a href={restaurant.url} target="_blank" rel="noreferrer">
                        {restaurant.distanceText}
                      </a>
                    ) : (
                      <strong>{restaurant.distanceText}</strong>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-text">주변 음식점을 찾지 못했습니다.</p>
            )}
          </section>
        </main>
      ) : (
        <main className="empty-start">
          <strong>추천을 준비하고 있습니다.</strong>
          <span>위치 정보를 확인한 뒤 오늘 어울리는 조합을 보여드릴게요.</span>
        </main>
      )}
    </div>
  )
}

interface ChoiceGroupProps<T extends string> {
  label: string
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
}

function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: ChoiceGroupProps<T>) {
  return (
    <div className="choice-group">
      <strong>{label}</strong>
      <div className="choice-list">
        {options.map((option) => (
          <button
            className={option.value === value ? 'choice selected' : 'choice'}
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function waitRemainingTime(startedAt: number) {
  const elapsed = Date.now() - startedAt
  const remaining = Math.max(0, MIN_LOADING_MS - elapsed)

  return new Promise((resolve) => {
    window.setTimeout(resolve, remaining)
  })
}
