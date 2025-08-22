import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchContentsThunk, deleteContentThunk } from '../../features/contentSlice'

import '../css/admin/ContentPanel.css'

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

  // 초기 + 필터 변경 시 1페이지 로드
  useEffect(() => {
    load(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, tag])

  const onSearch = (e) => {
    e.preventDefault()
    load(1)
  }

  const handleDelete = (id, title) => {
    if (!id) return
    const ok = window.confirm(`정말로 삭제할까요?\n\n제목: ${title || ''}`)
    if (!ok) return

    setDeletingId(id)
    dispatch(deleteContentThunk(id))
      .unwrap()
      .then(() => {
        // slice에서 리스트에서 제거됨
        // 필요 시 alert 대신 토스트로 교체 가능
        // eslint-disable-next-line no-alert
        alert('삭제되었습니다.')
      })
      .catch((e) => {
        console.error(e)
        alert('삭제에 실패했습니다.')
      })
      .finally(() => setDeletingId(null))
  }

  return (
    <div className="content-panel-wrap">
      <div className="content-panel-header">
        <h2>콘텐츠 관리</h2>
        {/* 등록 버튼 */}
        <button className="btn-primary" onClick={() => navigate('/contents/new')}>
          새 콘텐츠 등록
        </button>
      </div>

      <form className="content-panel-filters" onSubmit={onSearch}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">전체</option>
          <option value="published">발행됨</option>
          <option value="draft">임시저장</option>
        </select>
        <select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">태그 전체</option>
          <option value="GUIDE">GUIDE</option>
          <option value="TREND">TREND</option>
          <option value="STORY">STORY</option>
        </select>
        <input
          placeholder="검색(제목/요약)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn-secondary" type="submit">검색</button>
      </form>

      {error && (
        <div className="content-panel-error">
          {typeof error === 'string' ? error : '목록을 불러오는 중 오류가 발생했습니다.'}
        </div>
      )}

      <div className="content-panel-table">
        <div className="thead">
          <div>제목</div>
          <div>태그</div>
          <div>상태</div>
          <div>발행일</div>
          <div>배너</div>
          <div>액션</div>
        </div>
        <div className="tbody">
          {rows.map((r) => {
            const isDeleting = deletingId === r.id
            return (
              <div className="trow" key={r.id}>
                <div className="cell title">{r.title}</div>
                <div className="cell">{r.tag || '-'}</div>
                <div className={`cell status ${r.status}`}>{r.status}</div>
                <div className="cell">{(r.publishedAt || '').slice(0, 10)}</div>
                <div className="cell">{r.isFeatured ? '✓' : '-'}</div>
                <div className="cell actions">
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
            )
          })}

          {!rows.length && !loading && (
            <div className="trow empty">데이터가 없습니다.</div>
          )}
        </div>
      </div>

      {hasMore && (
        <div className="content-panel-loadmore">
          <button
            className="btn-secondary"
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
