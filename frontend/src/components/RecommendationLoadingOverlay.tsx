import { useEffect, useState } from 'react'

const loadingImages = [
  { src: '/imgs/pizza.png', label: '피자' },
  { src: '/imgs/pork.png', label: '고기' },
  { src: '/imgs/chicken.png', label: '치킨' },
  { src: '/imgs/skewer.png', label: '꼬치' },
]

export function RecommendationLoadingOverlay() {
  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setImageIndex((current) => (current + 1) % loadingImages.length)
    }, 520)

    return () => window.clearInterval(timer)
  }, [])

  const image = loadingImages[imageIndex]

  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-card">
        <div className="loading-image-frame">
          <img src={image.src} alt="" />
        </div>
        <div className="loading-copy">
          <strong>오늘의 조합을 고르는 중</strong>
          <span>{image.label}도 후보에 올려볼게요.</span>
        </div>
        <div className="loading-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}
