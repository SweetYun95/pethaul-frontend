// src/components/review/ItemReviewList.jsx
import { memo, useMemo } from 'react'
import ReviewCard from './ReviewCard'

/**
 * 리뷰 카드 리스트
 * - item?.Reviews 또는 reviews 배열을 받아 렌더링
 * - limit > 0 이면 최대 개수 제한
 * - 스타일은 MyReviewList.css의 .review-list / .contents-card 등 재사용
 */
function ItemReviewList({
  item,
  reviews,
  limit = 0,
  className = '',
  emptyText = '아직 등록된 리뷰가 없습니다.',
}) {
  const list = useMemo(() => {
    const base = Array.isArray(reviews)
      ? reviews
      : Array.isArray(item?.Reviews)
      ? item.Reviews
      : []
    return limit > 0 ? base.slice(0, limit) : base
  }, [reviews, item?.Reviews, limit])

  if (!list.length) return <p className="review-empty">{emptyText}</p>

  return (
    <div className={`review-list ${className}`.trim()}>
      {list.map((review, idx) => (
        <ReviewCard
          key={review?.id ?? `review-${idx}`}
          review={review}
        />
      ))}
    </div>
  )
}

export default memo(ItemReviewList)
