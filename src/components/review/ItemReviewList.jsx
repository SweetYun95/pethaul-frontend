// src/components/item/ItemReviewList.jsx
// MUI import 전부 제거!
function ItemReviewList({ item, avgRating, reviewCount }) {
  const reviews = item?.Reviews ?? []
  const count = Number.isFinite(reviewCount) ? reviewCount : reviews.length
  const hasReviews = reviews.length > 0
  const apiBase = import.meta.env.VITE_APP_API_URL

  return (
    <section className="review-section">
      <details className="accordion" open>
        <summary className="accordion__summary">
          <span className="review-title">REVIEW({count > 0 ? count : 0})</span>
          {hasReviews && <span className="avg-rating">{avgRating} / 5.0</span>}
        </summary>

        <div className="accordion__details">
          {hasReviews ? (
            <ul className="review-list">
              {reviews.map((review) => (
                <li className="review-item" key={review.id}>
                  {/* 리뷰 이미지 */}
                  <div className="review-images">
                    {(review?.ReviewImages ?? []).map((data, index) => (
                      <img
                        key={index}
                        src={`${apiBase}${data.imgUrl}`}
                        alt="리뷰 이미지"
                        width="80"
                        height="80"
                        loading="lazy"
                      />
                    ))}
                  </div>

                  {/* 리뷰 본문 */}
                  <div className="review-content">
                    <p className="review-text" title={review?.reviewContent || ''}>
                      {review?.reviewContent}
                    </p>
                  </div>

                  {/* 별점 */}
                  <div className="review-rating">
                    <span>별점 {review?.rating ?? '-'}</span>
                  </div>

                  {/* 작성자/날짜 */}
                  <div className="review-meta">
                    <strong>{review?.User?.name ?? '익명'}</strong>
                    <time dateTime={review?.reviewDate?.slice(0, 10)}>
                      {review?.reviewDate?.slice(0, 10) ?? ''}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>해당 상품에 등록된 리뷰가 없습니다.</p>
          )}
        </div>
      </details>
    </section>
  )
}

export default ItemReviewList
