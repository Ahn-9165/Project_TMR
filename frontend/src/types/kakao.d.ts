export {}

declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void
        LatLng: new (lat: number, lng: number) => KakaoLatLng
        Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap
        Marker: new (options: KakaoMarkerOptions) => KakaoMarker
        CustomOverlay: new (options: KakaoCustomOverlayOptions) => KakaoOverlay
        Circle: new (options: KakaoCircleOptions) => KakaoOverlay
      }
    }
  }

  interface KakaoLatLng {}

  interface KakaoMap {
    setCenter: (latlng: KakaoLatLng) => void
  }

  interface KakaoMapOptions {
    center: KakaoLatLng
    level: number
  }

  interface KakaoMarkerOptions {
    position: KakaoLatLng
    map?: KakaoMap
  }

  interface KakaoMarker {
    setMap: (map: KakaoMap | null) => void
  }

  interface KakaoCustomOverlayOptions {
    position: KakaoLatLng
    content: string | HTMLElement
    map?: KakaoMap
    yAnchor?: number
  }

  interface KakaoCircleOptions {
    center: KakaoLatLng
    radius: number
    strokeWeight?: number
    strokeColor?: string
    strokeOpacity?: number
    fillColor?: string
    fillOpacity?: number
    map?: KakaoMap
  }

  interface KakaoOverlay {
    setMap: (map: KakaoMap | null) => void
  }
}
