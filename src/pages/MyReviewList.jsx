import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteReviewThunk, getUserReviewThunk } from '../features/reviewSlice'
import { Link, useNavigate } from 'react-router-dom'
import './css/MyReviewList.css'

function MyReviewList() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { reviews, loading, error, pagination } = useSelector((state) => state.review)

   const [page, setPage] = useState(1)
   const LIMIT = 10

   useEffect(() => {
      dispatch(getUserReviewThunk({ page, limit: LIMIT }))
   }, [dispatch, page])

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
               {reviews.map((r) => (
                  <div key={r.id} className="contents-card">
                     <div className="card-header">
                        <div className="window-btn">
                           <span className="red"></span>
                           <span className="green"></span>
                           <span className="blue"></span>
                        </div>
                        <span className="contents-card-title">{r.reviewDate.slice(0, 10)}</span>
                     </div>
                     <div className="review-card">
                        <div className="review-left">{r.ReviewImages.length > 0 ? <img src={`${import.meta.env.VITE_APP_API_URL}${r.ReviewImages[0].imgUrl}`} alt="리뷰 이미지" className="review-img" /> : <div className="review-noimg">이미지 없음</div>}</div>

                  <div className="review-right">
                     <p className="review-item">{r.Item.itemNm}</p>
                     <div className='review-right__sub-info'>
                     <p className="review-rating">⭐ {r.rating}</p>
                     <p className="review-price">{r.Item.price}원</p>
                     </div>
                     <p className="review-content">{r.reviewContent}</p>

                           <div className="review-actions">
                              <Link to={`/review/edit/${r.id}`} state={{ review: r }} className="btn btn-edit">
                                 수정
                              </Link>
                              <button onClick={() => handleReviewDelete(r.id)} className="btn btn-delete">
                                 삭제
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
            {/*  하단 페이지네이션 배치 */}
            <div className="paginator bottom">
               <button className="btn" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  이전
               </button>
               <span className="page-indicator">
                  {pagination?.currentPage ?? page} / {pagination?.totalPages ?? '-'}
               </span>
               <button className="btn" disabled={pagination ? page >= pagination.totalPages : false} onClick={() => setPage((p) => p + 1)}>
                  다음
               </button>
            </div>
         </section>
      </div>
   )
}

export default MyReviewList
