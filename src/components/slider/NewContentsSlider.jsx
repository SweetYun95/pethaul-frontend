import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, A11y, Keyboard, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

import ContentCard from '../contents/ContentCard'
import '../css/slider/CommonSlider.css'

export default function NewContentsSlider({ posts = [], height = 500, space = 12 }) {
  if (!Array.isArray(posts) || posts.length === 0) return null

  return (
    <div className="commmon-vertical">
      <Swiper
        direction="vertical"                 // ✅ 세로
        slidesPerView={1}                    // ✅ 한 장
        spaceBetween={space}
        modules={[Pagination, A11y, Keyboard, Mousewheel]}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
        a11y={{ enabled: true }}
        autoHeight                           // 슬라이드 높이에 맞춰 자동
        style={{ height }}                   // 고정 높이 주고 싶으면 prop으로 조절
      >
        {posts.map((p, i) => (
          <SwiperSlide key={p?.id ?? p?._id ?? i} className="commmon-slide">
            <ContentCard item={p} post={p} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
