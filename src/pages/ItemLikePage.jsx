// src/pages/ItemLikePage.jsx (merge-resolved, fixed)
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

// ✅ likeSlice 쪽 Thunk들만 사용 (develop 기준)
import { fetchMyLikedItemsThunk, fetchMyLikeIdsThunk, toggleLikeThunk } from '../features/likeSlice'

// ✅ 스타일 (jse 기준)
import '../components/css/item/ItemSellList.css'

export default function ItemLikePage() {
  const dispatch = useDispatch()

  // ====== 초기 로드: 내 좋아요 상품 + 좋아요 ID맵 ======
  useEffect(() => {
    dispatch(fetchMyLikedItemsThunk())
    dispatch(fetchMyLikeIdsThunk())
  }, [dispatch])

  // likeSlice에서 상태 수급 (develop 기준 키 이름 가정)
  const {
    items: likedItems = [], // 좋아요한 상품 상세 배열
    idsMap: likes = {},     // { [itemId]: true }
    loadItemsLoading: loading,
    error,
  } = useSelector((s) => s.like || {})

  // ====== 필터 상태 ======
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedCats, setSelectedCats] = useState(() => new Set())
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sellStatus, setSellStatus] = useState('') // '', 'SELL', 'SOLD_OUT'
  const [inStockOnly, setInStockOnly] = useState(false)

  // ====== 유틸 ======
  const buildImgUrl = (url) => {
    if (!url) return '/images/no-image.jpg'
    if (/^https?:\/\//i.test(url)) return url
    const base = (import.meta.env.VITE_APP_API_URL || '').replace(/\/+$/, '')
    const path = String(url).replace(/^\/+/, '')
    return `${base}/${path}`
  }

  const getNumericPrice = (item) => {
    const raw = item?.price ?? item?.Price?.amount ?? item?.amount
    if (raw == null) return null
    const n = Number(String(raw).replace(/,/g, ''))
    return Number.isNaN(n) ? null : n
  }

  const formatPrice = (v) => {
    if (v == null) return null
    const n = Number(String(v).replace(/,/g, ''))
    if (Number.isNaN(n)) return null
    return new Intl.NumberFormat('ko-KR').format(n)
  }

  // ====== 목록/카테고리 파생 ======
  const list = useMemo(
    () => (Array.isArray(likedItems) ? likedItems.filter(Boolean) : []),
    [likedItems]
  )

  // 좋아요한 상품만 (방어적)
  const likedList = useMemo(
    () => list.filter((it) => !!likes[it.id]),
    [list, likes]
  )

  // likedList[*].Categories[]에서 유니크 카테고리
  const allCategories = useMemo(() => {
    const map = new Map()
    for (const it of likedList) {
      for (const c of it?.Categories ?? []) {
        const name = c?.categoryName ?? c?.name ?? ''
        if (name && !map.has(name)) map.set(name, { id: c?.id, name })
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  }, [likedList])

  // 필터링
  const filteredList = useMemo(() => {
    let arr = likedList

    if (selectedCats.size > 0) {
      arr = arr.filter((item) => {
        const names = (item?.Categories ?? [])
          .map((c) => c?.categoryName ?? c?.name)
          .filter(Boolean)
        return names.some((n) => selectedCats.has(n))
      })
    }

    if (sellStatus) {
      arr = arr.filter((item) => (item?.itemSellStatus ?? item?.sellStatus) === sellStatus)
    }

    if (inStockOnly) {
      const getStock = (it) => it?.stockNumber ?? it?.stock ?? it?.quantity
      arr = arr.filter((it) => Number(getStock(it)) > 0)
    }

    const min = priceMin === '' ? null : Number(priceMin)
    const max = priceMax === '' ? null : Number(priceMax)
    if (min != null || max != null) {
      arr = arr.filter((it) => {
        const p = getNumericPrice(it)
        if (p == null) return false
        if (min != null && p < min) return false
        if (max != null && p > max) return false
        return true
      })
    }

    return arr
  }, [likedList, selectedCats, sellStatus, inStockOnly, priceMin, priceMax])

  // ====== 활성 칩 ======
  const selectedCatNames = useMemo(() => Array.from(selectedCats), [selectedCats])

  const removeCat = (name) => {
    setSelectedCats((prev) => {
      const next = new Set(prev)
      next.delete(name)
      return next
    })
  }
  const clearCats = () => setSelectedCats(new Set())
  const clearSellStatus = () => setSellStatus('')
  const clearPrice = () => { setPriceMin(''); setPriceMax('') }

  const activeFilterChips = useMemo(() => {
    const chips = []
    selectedCatNames.forEach((n) => {
      chips.push({ key: `cat:${n}`, label: `#${n}`, onRemove: () => removeCat(n) })
    })
    if (sellStatus) {
      const label = sellStatus === 'SELL' ? '판매중' : sellStatus === 'SOLD_OUT' ? '품절' : sellStatus
      chips.push({ key: `status:${sellStatus}`, label: `상태 ${label}`, onRemove: clearSellStatus })
    }
    if (priceMin !== '' || priceMax !== '') {
      chips.push({ key: `price:${priceMin}-${priceMax}`, label: `가격 ${priceMin || 0} ~ ${priceMax || '∞'}`, onRemove: clearPrice })
    }
    return chips
  }, [selectedCatNames, sellStatus, priceMin, priceMax])

  // ====== 이벤트 ======
  const toggleCat = (name) => {                 // ← 추가된 부분
    setSelectedCats((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  const handleLike = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleLikeThunk(id)) // develop 기준 Thunk 사용
  }

  // ====== 로딩/에러 ======
  if (loading) {
    return (
      <section style={{backgroundImage: 'url(../../public/images/ribbon.jpeg)',backgroundRepeat: 'repeat',backgroundSize: '20%', paddingTop: '74px'}} id="itemlike-list" className="wrap">
        <div className="grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="card" key={i}>
              <div className="skeleton img" />
              <div className="content">
                <div className="skeleton text w70" />
                <div className="skeleton text w40" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section style={{backgroundImage: 'url(../../public/images/ribbon.jpeg)',backgroundRepeat: 'repeat',backgroundSize: '20%', paddingTop: '74px'}} id="itemlike-list" className="wrap center">
        <p className="error">에러 발생: {String(error)}</p>
        <button className="btn" onClick={() => { dispatch(fetchMyLikedItemsThunk()); dispatch(fetchMyLikeIdsThunk()) }}>다시 시도</button>
      </section>
    )
  }

  // ====== 렌더 ======
  return (
    <section style={{backgroundImage: 'url(../../public/images/ribbon.jpeg)',backgroundRepeat: 'repeat',backgroundSize: '20%', paddingTop: '74px'}} id="itemlike-list" className="wrap">
      <div style={{minHeight: '1000px',  maxWidth: '1200px',margin: '0 auto', padding: '20px'}}>
        <div className="contents-card item">
          <div className="item-card-header">
            <div className="window-btn">
              <span className="red"></span>
              <span className="green"></span>
              <span className="blue"></span>
            </div>

            <div className="card-title-wrap">
              {/* 타이틀: 선택 카테고리 */}
              <div className="title-selected-cats">
                {selectedCatNames.length > 0 ? (
                  selectedCatNames.map((n) => (
                    <span className="pill" key={`title-cat:${n}`}>#{n}</span>
                  ))
                ) : (
                  <span className="muted">좋아요한 상품</span>
                )}
              </div>

              {/* 필터 버튼 */}
              <button
                type="button"
                className="filter-toggle-btn"
                onClick={() => setIsFilterOpen((v) => !v)}
                aria-expanded={isFilterOpen}
                aria-controls="like-filter-panel"
                title="필터 열기/닫기"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                  <path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M10 8.5h11m-18 0a2 2 0 1 0 4 0a2 2 0 0 0-4 0m0 7h11m3 0a2 2 0 1 0 4 0a2 2 0 0 0-4 0" />
                </svg>
              </button>

            </div>
          </div>


          {/* 필터 패널 */}
          {isFilterOpen && (
            <div id="like-filter-panel" className="item-filter-panel">
              {/* 카테고리(다중) */}
              <div className="filter-row">
                <div className="filter-label">카테고리</div>
                <div className="filter-chips">
                  {allCategories.length === 0 ? (
                    <span className="muted">카테고리 데이터 없음</span>
                  ) : (
                    allCategories.map((c) => (
                      <button
                        type="button"
                        key={c.name}
                        className={`chip ${selectedCats.has(c.name) ? 'active' : ''}`}
                        onClick={() => toggleCat(c.name)}
                      >
                        #{c.name}
                      </button>
                    ))
                  )}
                  {selectedCats.size > 0 && (
                    <button type="button" className="btn-subtle" onClick={clearCats}>전체 해제</button>
                  )}
                </div>
              </div>

              {/* 가격 */}
              <div className="filter-row">
                <div className="filter-label">가격</div>
                <div className="price-filter">
                  <div className="price-inputs">
                    <input
                      inputMode="numeric"
                      placeholder="최저가"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value.replace(/[^\d]/g, ''))}
                    />
                    <span className="dash">~</span>
                    <input
                      inputMode="numeric"
                      placeholder="최고가"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value.replace(/[^\d]/g, ''))}
                    />
                  </div>
                  <button type="button" className="btn-subtle" onClick={clearPrice}>초기화</button>
                </div>
              </div>

              {/* 판매상태 */}
              <div className="filter-row">
                <div className="filter-label">판매상태</div>
                <div className="filter-bool">
                  <div className="segmented">
                    <button type="button" className={`seg-btn ${sellStatus === '' ? 'active' : ''}`} onClick={() => setSellStatus('')}>전체</button>
                    <button type="button" className={`seg-btn ${sellStatus === 'SELL' ? 'active' : ''}`} onClick={() => setSellStatus('SELL')}>판매중</button>
                    <button type="button" className={`seg-btn ${sellStatus === 'SOLD_OUT' ? 'active' : ''}`} onClick={() => setSellStatus('SOLD_OUT')}>품절</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 활성 칩 */}
        <div className="active-chips">
          {activeFilterChips.length > 0 ? (
            activeFilterChips.map((chip) => (
              <button className="chip-removable" key={chip.key} onClick={chip.onRemove}>
                <span>{chip.label}</span>
                <span className="chip-x" aria-label="remove">×</span>
              </button>
            ))
          ) : (
            <span className="muted"></span>
          )}
        </div>

        {/* Subbar: 재고 스위치 + 결과 개수 */}
        <div className="subbar">
          <div className="result-count">상품 {filteredList.length}개</div>
          <div className="stock-toggle">
            <label className="switch">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
            <span className="switch-label">재고만 보기</span>
          </div>
        </div>

        {/* 카드 리스트 */}
        {likedList.length === 0 ? (
          <div className="center"><p>좋아요한 상품이 없습니다.</p></div>
        ) : filteredList.length ? (
          <div className="item-panel-card-list">
            {filteredList.map((item) => {
              const repImage = item.ItemImages?.find((img) => img.repImgYn === 'Y')?.imgUrl || item.ItemImages?.[0]?.imgUrl
              const imgSrc = buildImgUrl(repImage)
              const liked = !!likes[item.id]
              const isSoldOut = (item.itemSellStatus ?? item.sellStatus) === 'SOLD_OUT'

              return (
                <Link key={item.id} to={`/items/detail/${item.id}`} className="card">
                  <div className="item-img like-btn">
                    <img src={imgSrc} alt={item.itemNm} />
                    <button
                      className={`like ${liked ? 'on' : ''}`}
                      aria-label={liked ? '좋아요 취소' : '좋아요'}
                      onClick={(e) => handleLike(e, item.id)}
                      type="button"
                      title={liked ? '좋아요 취소' : '좋아요'}
                    >
                      {liked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
                          <path fill="#f70000" stroke="#000" strokeWidth={1} d="M23 6v5h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1H9v-1H8v-1H7v-1H6v-1H5v-1H4v-1H3v-1H2v-1H1V6h1V5h1V4h1V3h6v1h1v1h2V4h1V3h6v1h1v1h1v1z"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24"><path fill="#000" d="M22 6V5h-1V4h-1V3h-6v1h-1v1h-2V4h-1V3H4v1H3v1H2v1H1v5h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h2v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1V6zm-2 4v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1H9v-1H8v-1H7v-1H6v-1H5v-1H4v-1H3V7h1V6h1V5h4v1h1v1h1v1h2V7h1V6h1V5h4v1h1v1h1v3z"></path></svg>
                      )}
                    </button>
                    {isSoldOut && <span className="badge badge-soldout">SOLD OUT</span>}
                  </div>

                  <div className="content">
                    <div className="cats">
                      {(item?.Categories ?? []).map((c) => (
                        <span key={`${item.id}-${c?.id ?? c?.categoryName}`} className="cat">#{c?.categoryName ?? c?.name}</span>
                      ))}
                    </div>
                    <p className="title" title={item.itemNm}>{item.itemNm}</p>
                    <p className="price">
                      {(() => {
                        const pretty = formatPrice(item.price ?? item?.Price?.amount ?? item?.amount)
                        return pretty ? `${pretty}원` : '가격 정보 없음'
                      })()}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="center"><p>필터에 해당하는 상품이 없습니다.</p></div>
        )}
      </div>
    </section>
  )

}
