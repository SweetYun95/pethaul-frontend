import { useDispatch, useSelector } from 'react-redux'
import { setFilters } from '../../features/filterSlice'
import { useMemo, useState } from 'react'

function ItemCardHeader({ title }) {
   const dispatch = useDispatch()
   const { sellStatus, priceMin, priceMax, selectedCats } = useSelector((state) => state.filter)
   const { items } = useSelector((state) => state.item)

   const [isFilterOpen, setIsFilterOpen] = useState(false)
   const [inputPriceMin, setInputPriceMin] = useState('')
   const [inputPriceMax, setInputPriceMax] = useState('')

   console.log('🎈state 확인 판매중:', sellStatus)
   // console.log('🎈state 확인 최저가:', inputPriceMin)
   // console.log('🎈state 확인 최고가:', priceMax)
   // console.log('🎈state 확인 최고가:', inputPriceMax)
   // console.log('🎈state 확인 카테고리필터:', selectedCats)

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

   // =======필터링=======
   // 카테고리 설정
   const handleToggleCat = (name) => {
      if (selectedCats) {
         const newCats = selectedCats.includes(name) ? selectedCats.filter((n) => n !== name) : [...selectedCats, name]
         dispatch(setFilters({ selectedCats: newCats }))
      }
   }
   // 선택된 카테고리 초기화
   const clearCats = () => {
      dispatch(setFilters({ selectedCats: [] }))
   }

   // 가격 필터(최저가, 최고가) 설정
   const setPrice = () => {
      setInputPriceMin('')
      setInputPriceMax('')
      dispatch(setFilters({ priceMin: inputPriceMin, priceMax: inputPriceMax }))
   }
   // 가격 필터 초기화
   const resetPrice = () => {
      setInputPriceMin('')
      setInputPriceMax('')
      dispatch(setFilters({ priceMin: '', priceMax: '' }))
   }

   // 판매 상태 필터 설정: 'SELL', 'SOLD_OUT'
   const handleToggleStatus = (status) => {
      if (sellStatus === status) {
         dispatch(setFilters({ sellStatus: '' }))
      } else {
         dispatch(setFilters({ sellStatus: status }))
      }
   }
   // 판매 상태 필터 초기화
   const resetToggleStatus = () => {
      dispatch(setFilters({ sellStatus: '' }))
   }

   // =======활성 칩=======
   const activeFilterChips = useMemo(() => {
      const chips = []
      selectedCats.forEach((n) => {
         chips.push({ key: `cat:${n}`, label: `#${n}`, onRemove: () => handleToggleCat(n) })
      })
      if (sellStatus) {
         const label = sellStatus === 'SELL' ? '판매중' : sellStatus === 'SOLD_OUT' ? '품절' : sellStatus
         const status = sellStatus
         chips.push({ key: `status:${sellStatus}`, label: `상태 ${label}`, onRemove: handleToggleStatus })
      }
      if (priceMin !== '' || priceMax !== '') {
         chips.push({ key: `price:${priceMin}-${priceMax}`, label: `가격 ${priceMin || 0} ~ ${priceMax || '∞'}`, onRemove: resetPrice })
      }
      return chips
   }, [selectedCats, sellStatus, priceMin, priceMax])

   return (
      <div className="contents-card item">
         <div className="item-card-header">
            <div className="window-btn">
               <span className="red"></span>
               <span className="green"></span>
               <span className="blue"></span>
            </div>

            <div className="card-title-wrap">
               <div className="title-selected-cats">
                  {title === '카테고리 전체' && selectedCats.length > 0 ? (
                     selectedCats.map((n) => (
                        <span className="pill" key={`title-cat:${n}`}>
                           #{n}
                        </span>
                     ))
                  ) : (
                     <span className="muted">{title}</span>
                  )}
               </div>

               <button type="button" className="filter-toggle-btn" onClick={() => setIsFilterOpen((v) => !v)} aria-expanded={isFilterOpen} aria-controls="item-filter-panel" title="필터 열기/닫기">
                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                     <path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 8.5h11m-18 0a2 2 0 1 0 4 0a2 2 0 0 0-4 0m0 7h11m3 0a2 2 0 1 0 4 0a2 2 0 0 0-4 0"></path>
                  </svg>
               </button>
            </div>
         </div>

         {isFilterOpen && (
            <div id="sell-filter-panel" className="item-filter-panel">
               {/* 카테고리(다중) */}
               <div className="filter-row">
                  <div className="filter-label">카테고리</div>
                  <div className="filter-chips">
                     {allCategories.length === 0 ? (
                        <span className="muted">카테고리 데이터 없음</span>
                     ) : (
                        allCategories.map((c) => (
                           <button type="button" key={c.name} className={`chip ${selectedCats.includes(c.name) ? 'active' : ''}`} onClick={() => handleToggleCat(c.name)}>
                              #{c.name}
                           </button>
                        ))
                     )}
                     {selectedCats.length > 0 && (
                        <button type="button" className="btn-subtle" onClick={clearCats}>
                           전체 해제
                        </button>
                     )}
                  </div>
               </div>

               {/* 가격 */}
               <div className="filter-row">
                  <div className="filter-label">가격</div>
                  <div className="price-filter">
                     <div className="price-inputs">
                        <input placeholder="최저가" value={inputPriceMin} onChange={(e) => setInputPriceMin(e.target.value)} />
                        <span className="dash">~</span>
                        <input placeholder="최고가" value={inputPriceMax} onChange={(e) => setInputPriceMax(e.target.value)} />
                     </div>
                     <button type="button" className="btn-subtle" onClick={() => setPrice()}>
                        검색
                     </button>
                     <button type="button" className="btn-subtle" onClick={() => resetPrice()}>
                        초기화
                     </button>
                  </div>
               </div>

               {/* 판매상태 */}
               <div className="filter-row">
                  <div className="filter-label">판매상태</div>
                  <div className="filter-bool">
                     <div className="segmented">
                        <button type="button" className={`seg-btn ${sellStatus === '' ? 'active' : ''}`} onClick={() => resetToggleStatus()}>
                           전체
                        </button>
                        <button type="button" className={`seg-btn ${sellStatus === 'SELL' ? 'active' : ''}`} onClick={() => handleToggleStatus('SELL')}>
                           판매중
                        </button>
                        <button type="button" className={`seg-btn ${sellStatus === 'SOLD_OUT' ? 'active' : ''}`} onClick={() => handleToggleStatus('SOLD_OUT')}>
                           품절
                        </button>
                     </div>
                  </div>
               </div>

               {/* 활성 칩 */}
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
            </div>
         )}
      </div>
   )
}

export default ItemCardHeader
