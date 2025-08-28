// src/pages/ReviewCreatePage.jsx
import { useLocation, Link } from 'react-router-dom'
import ReviewForm from '../components/review/ReviewForm'

function ReviewCreatePage() {
  const { state } = useLocation()
  const item = state?.item

  if (!item) {
    return (
      <div className="blue-background">
        <section id="review-section">
          <h1 className="section-title">리뷰 작성</h1>
          <div>상품 정보가 없습니다. 이전 페이지에서 다시 시도해 주세요.</div>
          <Link to="/" className="submit-btn">홈으로</Link>
        </section>
      </div>
    )
  }

  return (
    <div className="blue-background">
      <ReviewForm mode="create" item={item} onSuccess="/myreviewlist" />
    </div>
  )
}

export default ReviewCreatePage

