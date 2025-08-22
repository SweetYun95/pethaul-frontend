// src/components/admin/ContentPanel.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchContentsThunk, deleteContentThunk } from '../../features/contentSlice'
import AdminFilterForm from './AdminFilterForm'
import '../css/admin/AdminCards.css'

export default function ContentPanel() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const rows = useSelector((s) => s.content?.list ?? [])
  const page = useSelector((s) => s.content?.page ?? 1)
  const hasMore = useSelector((s) => s.content?.hasMore ?? false)
  const loading = useSelector((s) => s.content?.loading ?? false)
  const error = useSelector((s) => s.content?.error ?? null)

  const [q, setQ] = useState('')
  const [tag, setTag] = useState('')
  const [status, setStatus] = useState('all') // all | published | draft
  const [deletingId, setDeletingId] = useState(null)

  const size = 20

  const load = (nextPage = 1) => {
    return dispatch(
      fetchContentsThunk({
        page: nextPage,
        size,
        q: q || undefined,
        tag: tag || undefined,
        status, // 백엔드에서 관리자일 때만 all/draft 허용
      })
    )
      .unwrap()
      .catch((e) => {
        console.error('fetchContentsThunk error:', e)
      })
  }

  useEffect(() => {
    load(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, tag])

  const onSearch = (e) => {
    e.preventDefault()
    load(1)
  }

  const onReset = () => {
    setQ(''); setTag(''); setStatus('all')
    // 상태 바뀌면 useEffect로 1페이지 로드
    load(1)
  }

  const handleDelete = (id, title) => {
    if (!id) return
    const ok = window.confirm(`정말로 삭제할까요?\n\n제목: ${title || ''}`)
    if (!ok) return

    setDeletingId(id)
    dispatch(deleteContentThunk(id))
      .unwrap()
      .then(() => { alert('삭제되었습니다.') })
      .catch((e) => {
        console.error(e)
        alert('삭제에 실패했습니다.')
      })
      .finally(() => setDeletingId(null))
  }

  return (
    <div>
      <AdminFilterForm
        title="콘텐츠 관리"
        statusOptions={[
          { value: 'all', label: '전체' },
          { value: 'published', label: '발행됨' },
          { value: 'draft', label: '임시저장' },
        ]}
        tagOptions={[
          { value: '', label: '태그 전체' },
          { value: 'GUIDE', label: 'GUIDE' },
          { value: 'TREND', label: 'TREND' },
          { value: 'STORY', label: 'STORY' },
        ]}
        values={{ q, status, tag }}
        onChange={{ setQ, setStatus, setTag }}
        onSearch={onSearch}
        onReset={onReset}
        rightSlot={
          <button className="btn primary" onClick={() => navigate('/contents/new')}>
            새 콘텐츠 등록
          </button>
        }
      />

      {error && (
        <div className="admin-meta">
          {typeof error === 'string' ? error : '목록을 불러오는 중 오류가 발생했습니다.'}
        </div>
      )}

      <div className="admin-cards">
        {rows.map((r) => {
          const isDeleting = deletingId === r.id
          return (
            <div className="admin-card" key={r.id}>
              <div className="admin-card__list">
                <div>
                  <div className="cell-title">{r.title}</div>
                  <div className="admin-meta">
                    {(r.publishedAt || '').slice(0, 10)} · {r.tag || '-'} · {r.isFeatured ? '배너 노출' : '일반'}
                  </div>
                </div>

                <div className="admin-kv-group">
                  <div className="admin-kv"><span>상태</span>{r.status}</div>
                  <div className="admin-kv"><span>태그</span>{r.tag || '-'}</div>
                  <div className="admin-kv"><span>배너</span>{r.isFeatured ? '✓' : '-'}</div>
                </div>
              </div>

              <div className="admin-card__actions">
                <div className="admin-actions-row">
                  <button
                    className="btn-link"
                    onClick={() => navigate(`/contents/${r.id}`)}
                    disabled={isDeleting}
                  >
                    보기
                  </button>
                  <button
                    className="btn-link"
                    onClick={() => navigate(`/admin/contents/${r.id}/edit`)}
                    disabled={isDeleting}
                  >
                    수정
                  </button>
                  <button
                    className="btn-danger-link"
                    onClick={() => handleDelete(r.id, r.title)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? '삭제 중…' : '삭제'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {!rows.length && !loading && (
          <div className="admin-meta">데이터가 없습니다.</div>
        )}
      </div>

      {hasMore && (
        <div style={{ marginTop: 16 }}>
          <button
            className="btn secondary"
            disabled={loading}
            onClick={() => load(page + 1)}
          >
            {loading ? '로딩 중…' : '더 보기'}
          </button>
        </div>
      )}
    </div>
  )
}
