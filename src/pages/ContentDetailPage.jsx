import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchContentByIdThunk } from '../features/contentSlice'
import './css/ContentDetailPage.css'

export default function ContentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { current, loading, error } = useSelector((s) => s.content)

  useEffect(() => {
    if (id) {
      dispatch(fetchContentByIdThunk(id))
        .unwrap()
        .catch(() => { /* slice.error로 처리됨 */ })
    }
  }, [dispatch, id])

  if (loading && !current) {
    return <main className="content-detail-wrap">불러오는 중…</main>
  }

  if (error && !current) {
    return <main className="content-detail-wrap">오류: {String(error)}</main>
  }

  if (!current) return null

  return (
    <main className="content-detail-wrap">
      <button className="back-btn" onClick={() => navigate(-1)}>← 목록으로</button>
      
      <article className="content-detail">
        <header className="detail-header">
          <h1 className="detail-title">{current.title}</h1>
          <div className="detail-meta">
            <span className="detail-tag">{current.tag}</span>
            <span className="detail-author">{current.author}</span>
            <time>{(current.publishedAt || '').slice(0, 10)}</time>
          </div>
          {current.coverUrl && (
            <img className="detail-cover" src={current.coverUrl} alt={current.title} />
          )}
        </header>

        <section className="detail-body">
          <p>{current.summary}</p>
          {current.body && (
            <div
              className="detail-content"
              dangerouslySetInnerHTML={{ __html: current.body }}
            />
          )}
        </section>
      </article>
    </main>
  )
}
