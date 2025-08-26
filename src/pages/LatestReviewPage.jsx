import { useEffect, useRef, useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { fetchNewReviewsThunk } from '../features/reviewSlice'
import ReviewCard from '../components/review/ReviewCard'
import './css/LatestReviewPage.css'

export default function LatestReviewPage() {
  const dispatch = useDispatch()
  const mounted = useRef(false)

  const API = (`${import.meta.env.VITE_APP_API_URL || ''}`).replace(/\/$/, '')

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true
    ;(async () => {
      try {
        const payload = await dispatch(fetchNewReviewsThunk({ page: 1, size: 12 })).unwrap()
        const arr = Array.isArray(payload?.list) ? payload.list : []
        console.log('[LatestReviewPage] fetched len =', arr.length)
        setList(arr)
      } catch (e) {
        setError(e?.message || '로드 실패')
      } finally {
        setLoading(false)
      }
    })()
  }, [dispatch])

  const safe = useMemo(() => (Array.isArray(list) ? list : []), [list])

  return (
    <div className="dot-background" >
    <section id="latest-review-section" >
      <h2 className="section-title">Best Review</h2>

      {/* 상태 배너는 표시만 */}
      {loading && <p className="review-hint">로딩 중...</p>}
      {error &&   <p className="review-hint">에러: {error}</p>}

      <div className="review-list">
        {safe.map((r, i) => (
          <ReviewCard key={r?.id ?? `review-${i}`} review={r} apiBase={API} />
        ))}
      </div>
    </section>
      </div>
  )
}
