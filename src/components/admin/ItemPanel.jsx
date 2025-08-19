// src/components/admin/ItemPanel.jsx (fixed closing tags & structure)
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteItemThunk, fetchItemsThunk } from '../../features/itemSlice'
import { Link } from 'react-router-dom'
import '../css/admin/ItemPanel.css'

function ItemPanel({ searchTerm, sellCategory }) {
   const dispatch = useDispatch()
   const { items, loading, error } = useSelector((state) => state.item)

   // ----- Hooks (항상 최상단) -----
   const [isFilterOpen, setIsFilterOpen] = useState(false)
   const [selectedCats, setSelectedCats] = useState(() => new Set())
   const [priceMin, setPriceMin] = useState('')
   const [priceMax, setPriceMax] = useState('')
   const [sellStatus, setSellStatus] = useState('')
   const [inStockOnly, setInStockOnly] = useState(false) // 스위치

   useEffect(() => {
      dispatch(fetchItemsThunk({ searchTerm, sellCategory }))
   }, [dispatch, searchTerm, sellCategory])

   const baseURL = import.meta.env.VITE_APP_API_URL || ''

   const list = useMemo(() => (Array.isArray(items) ? items.filter(Boolean) : []), [items])

   const allCategories = useMemo(() => {
      const map = new Map()
      for (const it of list) {
         for (const c of it?.Categories ?? []) {
            const name = c?.categoryName ?? c?.name ?? ''
            if (name && !map.has(name)) map.set(name, { id: c?.id, name })
         }
      }
      return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'ko'))
   }, [list])

   const getNumericPrice = (item) => {
      const raw = item?.price ?? item?.Price?.amount ?? item?.amount
      if (raw == null) return null
      const n = Number(String(raw).replace(/,/g, ''))
      return Number.isNaN(n) ? null : n
   }

   const filteredList = useMemo(() => {
      let arr = list

      // 카테고리
      if (selectedCats.size > 0) {
         arr = arr.filter((item) => {
            const names = (item?.Categories ?? []).map((c) => c?.categoryName ?? c?.name).filter(Boolean)
            return names.some((n) => selectedCats.has(n))
         })
      }

      // 판매상태
      if (sellStatus) {
         arr = arr.filter((item) => {
            const s = item?.itemSellStatus ?? item?.sellStatus
            return s === sellStatus
         })
      }

      // 재고
      if (inStockOnly) {
         const getStock = (it) => it?.stockNumber ?? it?.stock ?? it?.quantity
         arr = arr.filter((it) => Number(getStock(it)) > 0)
      }

      // 가격
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
   }, [list, selectedCats, sellStatus, inStockOnly, priceMin, priceMax])

   // ---- 선택 카테고리 & 칩 구성 ----
   const selectedCatNames = useMemo(() => Array.from(selectedCats), [selectedCats])

   const removeCat = (name) => {
      setSelectedCats((prev) => {
         const next = new Set(prev)
         next.delete(name)
         return next
      })
   }
   const clearSellStatus = () => setSellStatus('')
   const clearPrice = () => {
      setPriceMin('')
      setPriceMax('')
   }

   const activeFilterChips = useMemo(() => {
      const chips = []
      // 개별 카테고리 칩
      selectedCatNames.forEach((n) => {
         chips.push({ key: `cat:${n}`, label: `#${n}`, onRemove: () => removeCat(n) })
      })
      // 판매상태 칩
      if (sellStatus) {
         const label = sellStatus === 'SELL' ? '판매중' : sellStatus === 'SOLD_OUT' ? '품절' : sellStatus
         chips.push({ key: `status:${sellStatus}`, label: `상태 ${label}`, onRemove: clearSellStatus })
      }
      // 가격 칩
      if (priceMin !== '' || priceMax !== '') {
         chips.push({ key: `price:${priceMin}-${priceMax}`, label: `가격 ${priceMin || 0} ~ ${priceMax || '∞'}`, onRemove: clearPrice })
      }
      return chips
   }, [selectedCatNames, sellStatus, priceMin, priceMax])

   // ---- Helpers ----
   const resolveImage = (item) => {
      const rep = item?.ItemImages?.find((img) => img?.repImgYn === 'Y') ?? item?.ItemImages?.[0]
      const url = rep?.imgUrl
      if (!url) return '/images/placeholder.png'
      return /^https?:\/\//i.test(url) ? url : `${baseURL}${url}`
   }

   const formatPrice = (v) => {
      if (v == null) return null
      const n = Number(String(v).replace(/,/g, ''))
      if (Number.isNaN(n)) return null
      return new Intl.NumberFormat('ko-KR').format(n)
   }

   const toggleCat = (name) => {
      setSelectedCats((prev) => {
         const next = new Set(prev)
         next.has(name) ? next.delete(name) : next.add(name)
         return next
      })
   }
   const clearCats = () => setSelectedCats(new Set())
   const selectAllCats = () => setSelectedCats(new Set(allCategories.map((c) => c.name)))

   const onClickDelete = (itemId) => {
      if (!itemId) return
      if (confirm('정말 삭제하시겠습니까?')) {
         dispatch(deleteItemThunk(itemId))
            .unwrap()
            .then(() => {
               alert('상품이 삭제되었습니다!')
               dispatch(fetchItemsThunk({ searchTerm, sellCategory }))
            })
            .catch(() => alert('상품 삭제 중 오류 발생'))
      }
   }

   // ---- Early return (모든 훅 이후) ----
   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러가 발생했습니다.: {String(error)}</p>

   // ---- Render ----
   return (
      <section id="itempanel-section">
         <div className="itempanel-contents">
            <div className="contents-card item">
               <div className="item-card-header">
                  <div className="window-btn">
                     <span className="red"></span>
                     <span className="green"></span>
                     <span className="blue"></span>
                  </div>

                  {/* 상단 타이틀: 선택 카테고리만 */}
                  <div className="card-title-wrap">
                     <div className="title-selected-cats">
                        {selectedCatNames.length > 0 ? (
                           selectedCatNames.map((n) => (
                              <span className="pill" key={`title-cat:${n}`}>
                                 #{n}
                              </span>
                           ))
                        ) : (
                           <span className="muted">카테고리 전체</span>
                        )}
                     </div>

                     {/* 필터 버튼 */}
                     <button type="button" className="filter-toggle-btn" onClick={() => setIsFilterOpen((v) => !v)} aria-expanded={isFilterOpen} aria-controls="item-filter-panel" title="필터 열기/닫기">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                           <path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 8.5h11m-18 0a2 2 0 1 0 4 0a2 2 0 0 0-4 0m0 7h11m3 0a2 2 0 1 0 4 0a2 2 0 0 0-4 0" />
                        </svg>
                     </button>
                  </div>
               </div>

               {/* 필터 패널 */}
               {isFilterOpen && (
                  <div id="item-filter-panel" className="item-filter-panel">
                     {/* 카테고리 */}
                     <div className="filter-row">
                        <div className="filter-label">카테고리</div>
                        <div className="filter-chips">
                           {allCategories.length === 0 ? (
                              <span className="muted">카테고리 데이터 없음</span>
                           ) : (
                              allCategories.map((c) => (
                                 <button type="button" key={c.name} className={`chip ${selectedCats.has(c.name) ? 'active' : ''}`} onClick={() => toggleCat(c.name)}>
                                    #{c.name}
                                 </button>
                              ))
                           )}
                           {selectedCats.size > 0 && (
                              <div className="filter-actions">
                                 <button type="button" className="btn-subtle" onClick={clearCats}>
                                    전체 해제
                                 </button>
                                 <button type="button" className="btn-subtle" onClick={selectAllCats}>
                                    전체 선택
                                 </button>
                              </div>
                           )}
                        </div>
                     </div>

                     {/* 가격 */}
                     <div className="filter-row">
                        <div className="filter-label">가격</div>
                        <div className="price-filter">
                           <div className="price-inputs">
                              <input inputMode="numeric" placeholder="최저가" value={priceMin} onChange={(e) => setPriceMin(e.target.value.replace(/[^\d]/g, ''))} />
                              <span className="dash">~</span>
                              <input inputMode="numeric" placeholder="최고가" value={priceMax} onChange={(e) => setPriceMax(e.target.value.replace(/[^\d]/g, ''))} />
                           </div>
                           <button
                              type="button"
                              className="btn-subtle"
                              onClick={() => {
                                 setPriceMin('')
                                 setPriceMax('')
                              }}
                           >
                              초기화
                           </button>
                        </div>
                     </div>

                     {/* 판매상태 */}
                     <div className="filter-row">
                        <div className="filter-label">판매상태</div>
                        <div className="filter-bool">
                           <div className="segmented">
                              <button type="button" className={`seg-btn ${sellStatus === '' ? 'active' : ''}`} onClick={() => setSellStatus('')}>
                                 전체
                              </button>
                              <button type="button" className={`seg-btn ${sellStatus === 'SELL' ? 'active' : ''}`} onClick={() => setSellStatus('SELL')}>
                                 판매중
                              </button>
                              <button type="button" className={`seg-btn ${sellStatus === 'SOLD_OUT' ? 'active' : ''}`} onClick={() => setSellStatus('SOLD_OUT')}>
                                 품절
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* 🔹 활성 칩 */}
            <div className="active-chips">
               {activeFilterChips.length > 0 ? (
                  activeFilterChips.map((chip) => (
                     <button className="chip-removable" key={chip.key} onClick={chip.onRemove}>
                        <span>{chip.label}</span>
                        <span className="chip-x" aria-label="remove">
                           ×
                        </span>
                     </button>
                  ))
               ) : (
                  <span className="muted"></span>
               )}
            </div>

            {/* 🔹 Subbar: 재고 스위치 + 결과 개수 */}
            <div className="subbar">
               <div className="result-count">상품 {filteredList.length}개</div>
               <div className="stock-toggle">
                  <label className="switch">
                     <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                     <span className="slider"></span>
                  </label>
                  <span className="switch-label">재고만 보기</span>
               </div>
            </div>

            {/* 카드 리스트 */}
            <div className="item-panel-card-list">
               {filteredList.map((item, idx) => (
                  <div className="item-panel-card" key={item?.id ?? idx}>
                     <div className="item-img">
                        <button className="item-panel-delete-btn" style={{ all: 'unset', padding: '10px', position: 'absolute', top: 0, right: 0 }} onClick={() => onClickDelete(item?.id)} title="삭제">
                           x
                        </button>
                        <img src={resolveImage(item)} alt={item?.itemNm ?? '상품 이미지'} />
                     </div>
                     <div className="item-panel-info">
                        <div className="item-panel-info-title">
                           <p className="name">{item?.itemNm ?? '이름없음'}</p>
                           <Link to={`/items/edit/${item?.id}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 32 32">
                                 <path
                                    fill="#000"
                                    d="M30.48 12.19H32v16.76h-1.52Zm0-9.14H32v4.57h-1.52Zm-1.53 25.9h1.53v1.53h-1.53Zm0-21.33h1.53v1.52h-1.53Zm0-6.1h1.53v1.53h-1.53Zm-1.52 7.62h1.52v1.53h-1.52Zm0-3.04h1.52v1.52h-1.52ZM3.05 30.48h25.9V32H3.05Zm22.86-19.81h1.52v1.52h-1.52Zm0-6.1h1.52V6.1h-1.52ZM24.38 0h4.57v1.52h-4.57Zm0 12.19h1.53v1.52h-1.53Zm0-6.09h1.53v1.52h-1.53Zm0-3.05h1.53v1.52h-1.53Zm-1.52 10.66h1.52v1.53h-1.52Zm0-6.09h1.52v1.52h-1.52Zm0-6.1h1.52v1.53h-1.52Zm-1.53 13.72h1.53v1.52h-1.53Zm0-6.1h1.53v1.53h-1.53Zm0-6.09h1.53v1.52h-1.53Zm-1.52 13.71h1.52v1.53h-1.52Zm0-6.09h1.52v1.52h-1.52Zm0-6.1h1.52V6.1h-1.52Zm-1.52 10.67h1.52v1.52h-1.52Zm0-3.05h1.52v1.52h-1.52Zm0-6.09h1.52v1.52h-1.52Z"
                                    strokeWidth={1}
                                    stroke="#000"
                                 ></path>
                                 <path
                                    fill="#000"
                                    d="M16.76 16.76h-1.52v-1.52h-1.53v-3.05h-1.52v7.62h7.62v-1.52h-3.05zm0-3.05h1.53v1.53h-1.53Zm0-6.09h1.53v1.52h-1.53Zm-1.52 4.57h1.52v1.52h-1.52Zm0-3.05h1.52v1.53h-1.52Zm-1.53 1.53h1.53v1.52h-1.53ZM3.05 1.52h15.24v1.53H3.05ZM1.52 28.95h1.53v1.53H1.52Zm0-25.9h1.53v1.52H1.52ZM0 4.57h1.52v24.38H0Z"
                                    strokeWidth={1}
                                    stroke="#000"
                                 ></path>
                              </svg>
                           </Link>
                        </div>
                        {(item?.Categories ?? []).map((ic) => (
                           <p className="category" key={ic?.id ?? `${item?.id}-cat`}>
                              #{ic?.categoryName ?? ic?.name ?? ''}
                           </p>
                        ))}
                        {(() => {
                           const raw = item?.price ?? item?.Price?.amount ?? item?.amount
                           const pretty = formatPrice(raw)
                           return <p className="price">{pretty ? `₩${pretty}` : '가격 정보 없음'}</p>
                        })()}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   )
}

export default ItemPanel
