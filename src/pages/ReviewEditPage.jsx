// src/pages/ReviewEditPage.jsx
import { useLocation, useParams, Link } from 'react-router-dom'
import ReviewForm from '../components/review/ReviewForm'

function ReviewEditPage() {
  const { id } = useParams()
  const { state } = useLocation()
  const review = state?.review

  // 기존 이미지 URL 필드명이 다를 수 있어 안전하게 추출
  const existingImgs =
    review?.images ??
    review?.ReviewImages?.map((ri) => ri.url || ri.imageUrl) ??
    []

  if (!review) {
    return (
      <div className="blue-background">
        <section id="review-section">
          <h1 className="section-title">리뷰 수정</h1>
          <div>리뷰 데이터가 없습니다. 목록에서 다시 진입해 주세요.</div>
          <Link to="/myreviewlist" className="submit-btn">내 리뷰로</Link>
        </section>
      </div>
    )
  }

  return (
    <div className="blue-background">
      <ReviewForm
        mode="edit"
        reviewId={id}
        review={review}
        existingImgs={existingImgs}
        onSuccess="/"
      />
    </div>
  )
}

export default ReviewEditPage

