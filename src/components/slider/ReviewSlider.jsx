// src/components/slider/ReviewSlider.jsx
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, A11y, Keyboard, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import '../css/slider/CommonSlider.css'    

export default function ReviewSlider({
  reviews = [],
  height = 180,
  space = 0,
  apiBase = import.meta.env.VITE_APP_API_URL,
}) {
  if (!Array.isArray(reviews) || reviews.length === 0) return null

  const getImages = (r) => r?.ReviewImages || r?.images || r?.imageUrls || []
  const getRating = (r) => {
    const v = Number(r?.rating ?? r?.score ?? 0)
    return Number.isFinite(v) ? Math.max(0, Math.min(5, v)) : 0
  }
  const getName = (r) => r?.User?.name ?? r?.userName ?? '익명'
  const getDate = (r) => (r?.reviewDate ?? r?.createdAt ?? '').slice(0, 10)
  const getText = (r) => r?.reviewContent ?? r?.content ?? r?.text ?? ''

  return (
    // ✅ 공통 래퍼: nc-vertical + common-viewport
    <div className="nc-vertical common-viewport">
      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={space}
        modules={[Pagination, A11y, Keyboard, Mousewheel]}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
        a11y={{ enabled: true }}
        autoHeight
        style={{ height }}
      >
        {reviews.map((r, i) => {
          const imgs = getImages(r)
          const rating = getRating(r)
          const stars = Math.round(rating)

          return (
            <SwiperSlide key={r?.id ?? i} className="nc-slide">
              <article className="review-card">
                {imgs.length > 0 && (
                  <div className="review-card__images">
                    {imgs.slice(0, 3).map((img, idx) => {
                      const src = typeof img === 'string'
                        ? img
                        : `${apiBase}${img?.imgUrl ?? ''}`
                      return (
                        <div className="thumb" key={idx}>
                          <img src={src} alt="리뷰 이미지" loading="lazy" />
                          {idx === 2 && imgs.length > 3 && (
                            <span className="more">+{imgs.length - 3}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                <div className="review-card__body">
                  {/* ✅ 글씨만 안 넘치게(멀티라인 말줄임) */}
                  <p className="review-card__text" title={getText(r)}>
                    {getText(r)}
                  </p>

                  <div className="review-card__meta">
                    <div className="review-card__stars" aria-label={`별점 ${rating} / 5`} title={`${rating} / 5`}>
                      <span>별점 {rating}</span>
                    </div>

                    <div className="review-card__author">
                      <strong>{getName(r)}</strong>
                      <time dateTime={getDate(r)}>{getDate(r)}</time>
                    </div>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
