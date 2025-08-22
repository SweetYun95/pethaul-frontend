// src/pages/ContentsPage.jsx
import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  fetchContentsThunk,
} from '../features/contentSlice'
import { ContentHero, ContentGrid, SkeletonHero, SkeletonGrid } from '../components/contents'
import './css/ContentsPage.css'

export default function ContentsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 로그인 사용자(관리자 판별)
  const user = useSelector((s) => s.auth?.user)
  const isAdmin = !!user && (user.isAdmin === true || user.role === 'admin' || user.role === 'ADMIN')

  const hero = useSelector((s) => s.content.hero)
  const list = useSelector((s) => s.content.list)
  const page = useSelector((s) => s.content.page)
  const hasMore = useSelector((s) => s.content.hasMore)
  const loading = useSelector((s) => s.content.loading)
  const error = useSelector((s) => s.content.error)

  const [initialLoading, setInitialLoading] = useState(true)
  const [moreLoading, setMoreLoading] = useState(false)

  const tag = searchParams.get('tag') || undefined
  const q = searchParams.get('q') || undefined
  const size = 10

  const load = useCallback(
    async (nextPage = 1) => {
      try {
        if (nextPage === 1) setInitialLoading(true)
        else setMoreLoading(true)

        await dispatch(fetchContentsThunk({ page: nextPage, size, tag, q })).unwrap()
      } catch (e) {
        console.error('fetchContentsThunk error:', e)
      } finally {
        if (nextPage === 1) setInitialLoading(false)
        else setMoreLoading(false)
      }
    },
    [dispatch, tag, q]
  )

  useEffect(() => {
    load(1)
  }, [load])

  const goDetail = (post) => {
    if (!post) return
    navigate(`/contents/${post.id}`)
  }

  return (
    <main className="contents-wrap">
      <h1 className="page-title">Contents</h1>

      {/* 관리자만 보이는 등록 버튼 */}
      {isAdmin && (
        <div className="admin-actions">
          <button
            type="button"
            className="btn-admin-primary"
            onClick={() => navigate('/contents/new')}
          >
            컨텐츠 등록
          </button>
        </div>
      )}


      {error && (
        <div className="error-message">
          {typeof error === 'string' ? error : '콘텐츠를 불러오지 못했습니다.'}
        </div>
      )}

      {initialLoading && !hero ? (
        <>
          <SkeletonHero />
          <SkeletonGrid />
        </>
      ) : (
        <>
          <ContentHero post={hero} onClick={goDetail} />

          {list.length > 0 ? (
            <ContentGrid posts={list} onItemClick={goDetail} />
          ) : (
            <p className="empty-message">표시할 콘텐츠가 없습니다.</p>
          )}

          {hasMore && (
            <div className="loadmore-wrap">
              <button
                className="loadmore-btn"
                onClick={() => load(page + 1)}
                disabled={moreLoading || loading}
                aria-busy={moreLoading || loading}
              >
                {moreLoading ? '로딩 중…' : '더 보기'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
