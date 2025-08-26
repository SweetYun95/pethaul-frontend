import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteReviewThunk, getUserReviewThunk } from '../features/reviewSlice'
import { Link, useNavigate } from 'react-router-dom'
import ReviewCard from '../components/review/ReviewCard'
import './css/MyReviewList.css'

function MyReviewList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { reviews, loading, error } = useSelector((state) => state.review)

  // 이미지 절대경로 베이스
  const API = (`${import.meta.env.VITE_APP_API_URL || ''}`).replace(/\/$/, '')

  useEffect(() => {
    dispatch(getUserReviewThunk())
  }, [dispatch])

  const handleReviewDelete = (id) => {
    const res = confirm('정말 삭제하시겠습니까?')
    if (!res) return

    dispatch(deleteReviewThunk(id))
      .unwrap()
      .then(() => {
        alert('후기를 삭제했습니다!')
        dispatch(getUserReviewThunk())
        navigate('/myreviewlist')
      })
      .catch((error) => {
        alert('후기 삭제에 실패했습니다: ' + error)
        console.log('후기 삭제 중 에러 발생: ' + error)
      })
  }

  if (loading) return <p>로딩 중...</p>
  if (error) return <p>에러 발생: {error}</p>

  return (
    <div className="dot-background">
      <section id="myreview-section">
        <h2 className="section-title">리뷰 목록</h2>

        <div className="review-list">
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((r) => (
              <ReviewCard
                key={r.id}
                review={r}
                apiBase={API}
                actions={
                  <>
                    <Link
                      to={`/review/edit/${r.id}`}
                      state={{ review: r }}
                      className="btn btn-edit"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleReviewDelete(r.id)}
                      className="btn btn-delete"
                    >
                      삭제
                    </button>
                  </>
                }
              />
            ))
          ) : (
            <p className="review-empty">아직 등록된 리뷰가 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default MyReviewList
