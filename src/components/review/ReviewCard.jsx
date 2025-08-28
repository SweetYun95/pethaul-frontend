import '../css/review/ReviewCard.css'
// 상대경로 → 절대경로
const toAbs = (apiBase = '', url = '') => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const base = (apiBase || '').replace(/\/$/, '')
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}

/**
 * 공용 리뷰 카드
 * - MyReviewList와 동일한 마크업/클래스 사용
 * - actions 슬롯으로 버튼 영역을 주입 가능
 */
export default function ReviewCard({ review, apiBase, actions, className = '' }) {
  const dateStr = (review?.reviewDate ?? review?.createdAt ?? '').slice(0, 10)
  const imgs = Array.isArray(review?.ReviewImages) ? review.ReviewImages : []
  const firstImg = imgs.length ? (typeof imgs[0] === 'string' ? imgs[0] : imgs[0]?.imgUrl) : null
  const itemNm = review?.Item?.itemNm ?? '상품명'
  const price  = review?.Item?.price
  const rating = review?.rating ?? '-'
  const content = review?.reviewContent ?? ''

  return (
    <div className={`contents-card ${className}`}>
      <div className="card-header">
        <div className="window-btn">
          <span className="red"></span>
          <span className="green"></span>
          <span className="blue"></span>
        </div>
        <span className="contents-card-title">{dateStr}</span>
      </div>

      <div className="review-card">
        <div className="review-left">
          {firstImg ? (
            <img
              src={toAbs(apiBase, firstImg)}
              alt="리뷰 이미지"
              className="review-img"
              loading="lazy"
            />
          ) : (
            <div className="review-noimg">이미지 없음</div>
          )}
        </div>

        <div className="review-right">
          <p className="review-item">{itemNm}</p>

          <div className="review-right__sub-info">
            <p className="review-rating">⭐ {rating}</p>
            <p className="review-price">{price != null ? `${price}원` : ''}</p>
          </div>

          <p className="review-content">{content}</p>

          {actions ? <div className="review-actions">{actions}</div> : null}
        </div>
      </div>
    </div>
  )
}
