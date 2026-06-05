import { useEffect, useRef, useState } from 'react'
import type { LocationSummary, Restaurant } from '../types/recommendation'

interface KakaoRestaurantMapProps {
  location: LocationSummary
  restaurants: Restaurant[]
}

const markerLabels: Record<string, string> = {
  chicken: '치킨',
  pizza: '피자',
  burger: '버거',
  korean: '한식',
  western: '양식',
  japanese: '일식',
  chinese: '중식',
  restaurant: '맛집',
}

export function KakaoRestaurantMap({
  location,
  restaurants,
}: KakaoRestaurantMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<KakaoMap | null>(null)
  const overlaysRef = useRef<KakaoOverlay[]>([])
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const appKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY

    if (!appKey) {
      setError('카카오 JavaScript 키가 필요합니다.')
      return
    }

    if (window.kakao?.maps) {
      window.kakao.maps.load(() => setIsReady(true))
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-map-sdk="true"]',
    )

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        window.kakao?.maps.load(() => setIsReady(true))
      })
      return
    }

    const script = document.createElement('script')
    script.dataset.kakaoMapSdk = 'true'
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`
    script.async = true
    script.onload = () => {
      window.kakao?.maps.load(() => setIsReady(true))
    }
    script.onerror = () => {
      setError('카카오 지도를 불러오지 못했습니다.')
    }
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    const maps = window.kakao?.maps
    const container = containerRef.current

    if (!isReady || !maps || !container) return

    const center = new maps.LatLng(location.lat, location.lng)
    const map =
      mapRef.current ??
      new maps.Map(container, {
        center,
        level: 4,
      })

    mapRef.current = map
    map.setCenter(center)

    overlaysRef.current.forEach((overlay) => overlay.setMap(null))
    overlaysRef.current = []

    const range = new maps.Circle({
      center,
      radius: 1000,
      strokeWeight: 2,
      strokeColor: '#295180',
      strokeOpacity: 0.75,
      fillColor: '#e9f1ff',
      fillOpacity: 0.22,
      map,
    })
    overlaysRef.current.push(range)

    const userMarker = new maps.CustomOverlay({
      map,
      position: center,
      yAnchor: 1,
      content: '<div class="map-marker user-marker">내 위치</div>',
    })
    overlaysRef.current.push(userMarker)

    restaurants.forEach((restaurant) => {
      const position = new maps.LatLng(restaurant.lat, restaurant.lng)
      const label = markerLabels[restaurant.iconType ?? 'restaurant'] ?? '맛집'
      const safeName = escapeHtml(restaurant.name)
      const safeUrl = restaurant.url ? escapeAttribute(restaurant.url) : '#'
      const marker = new maps.CustomOverlay({
        map,
        position,
        yAnchor: 1,
        content: `<a class="map-marker place-marker" href="${safeUrl}" target="_blank" rel="noreferrer"><span>${label}</span><strong>${safeName}</strong></a>`,
      })
      overlaysRef.current.push(marker)
    })
  }, [isReady, location.lat, location.lng, restaurants])

  if (error) {
    return <div className="map-empty">{error}</div>
  }

  return <div className="map-canvas" ref={containerRef} />
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replaceAll('`', '&#096;')
}
