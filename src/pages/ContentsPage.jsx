// src/pages/ContentsPage.jsx
import { useEffect, useState } from 'react'
import './css/ContentsPage.css'
import { ContentHero, ContentGrid, SkeletonHero, SkeletonGrid } from '../components/contents'
import { makeMock } from '../utils/mockContents' // 선택사항: 아래 대안 주석 참고

function ContentsPage() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchContents(1, true)
    // eslint-disable-next-line
  }, [])

  const fetchContents = async (nextPage = 1, replace = false) => {
    try {
      setLoading(true)
      // ★ 실제 API 연결 시 아래 3줄만 교체
      // const res = await fetch(`/api/contents?page=${nextPage}&size=10`)
      // const data = await res.json()
      const data = { list: makeMock(nextPage), hasMore: nextPage < 3 }

      setPosts((prev) => (replace ? data.list : [...prev, ...data.list]))
      setHasMore(data.hasMore)
      setPage(nextPage)
    } catch (e) {
      console.error('fetchContents error:', e)
    } finally {
      setLoading(false)
    }
  }

  const hero = posts[0]
  const grid = posts.slice(1)

  return (
    <main className="contents-wrap">
      <h1 className="page-title">Contents</h1>

      {loading && posts.length === 0 ? (
        <>
          <SkeletonHero />
          <SkeletonGrid />
        </>
      ) : (
        <>
          <ContentHero post={hero} />

          <ContentGrid posts={grid} />

          {hasMore && (
            <div className="loadmore-wrap">
              <button
                className="loadmore-btn"
                onClick={() => fetchContents(page + 1)}
                disabled={loading}
              >
                {loading ? '로딩 중…' : '더 보기'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default ContentsPage
