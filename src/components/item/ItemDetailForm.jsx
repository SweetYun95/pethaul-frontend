// src/components/item/ItemDetailForm.jsx
import { useState, useMemo, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToCartThunk } from '../../features/cartSlice'
import ItemReviewList from '../review/ItemReviewList'
import { Link } from 'react-router-dom'
import '../css/item/ItemDetailForm.css'

function ItemDetailForm({ item }) {
   const dispatch = useDispatch()
   const [quantity, setQuantity] = useState(1)

   // 아코디언: 한 섹션만 열림. 기본은 'detail'
   const [openKey, setOpenKey] = useState('detail')
   const toggle = (key) => setOpenKey((prev) => (prev === key ? null : key))

   if (!item) return <p>상품 정보를 불러오는 중입니다...</p>

   // 이미지 준비
   const repImg = useMemo(() => (Array.isArray(item.ItemImages) ? item.ItemImages.find((img) => img.repImgYn === 'Y') : null), [item?.ItemImages])
   const subImgs = useMemo(() => (Array.isArray(item.ItemImages) ? item.ItemImages.filter((img) => img.repImgYn === 'N') : []), [item?.ItemImages])

   const apiBase = import.meta.env.VITE_APP_API_URL || ''

   // 썸네일(대표 + 서브) 합치기 (대표 우선, 중복 제거)
   const thumbSrcs = useMemo(() => {
      const list = []
      if (repImg?.imgUrl) list.push(`${apiBase}${repImg.imgUrl}`)
      for (const img of subImgs) list.push(`${apiBase}${img.imgUrl}`)
      return Array.from(new Set(list))
   }, [repImg, subImgs, apiBase])

   // 메인 이미지 상태
   const [mainSrc, setMainSrc] = useState(thumbSrcs[0] || '/images/placeholder.png')
   useEffect(() => {
      setMainSrc(thumbSrcs[0] || '/images/placeholder.png')
   }, [thumbSrcs])

   // 평균 평점
   const { avgRating, reviewCount } = useMemo(() => {
      const list = Array.isArray(item?.Reviews) ? item.Reviews : []
      const valid = list.filter((r) => r?.rating !== null && r?.rating !== undefined)
      const total = valid.reduce((sum, r) => sum + Number(r.rating || 0), 0)
      const count = valid.length
      const avg = count ? total / count : 0
      return { avgRating: Math.round(avg * 10) / 10, reviewCount: count }
   }, [item?.Reviews])

   // 수량/장바구니
   const handleQuantityChange = (e) => setQuantity(Math.max(1, Number(e.target.value) || 1))
   const handleAddToCart = async () => {
      try {
         await dispatch(addToCartThunk({ itemId: item.id, count: quantity })).unwrap()
         alert('장바구니에 추가되었습니다.')
      } catch (err) {
         alert(`장바구니 추가 실패: ${err}`)
      }
   }

   // 상품 문의 상태
   const [inquiry, setInquiry] = useState({ name: '', contact: '', content: '', isPrivate: false })
   const handleInquiryChange = (e) => {
      const { name, value, type, checked } = e.target
      setInquiry((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
   }
   const submitInquiry = (e) => {
      e.preventDefault()
      if (!inquiry.content.trim()) return alert('문의 내용을 입력해 주세요.')
      console.log('[상품문의] 제출', { itemId: item.id, ...inquiry })
      alert('문의가 등록되었습니다.')
      setInquiry({ name: '', contact: '', content: '', isPrivate: false })
   }

   return (
      <section id="item-detail-section">
         {/* 상단: 이미지/정보 영역 */}
         <div className="top-section">
            <div className="item-detail-left">
               <div className="subitem-img-group">
                  {/* 썸네일: 대표+서브 */}
                  <div className="subitem-img">
                     {thumbSrcs.map((src, index) => {
                        const active = mainSrc === src
                        return <img key={`${src}-${index}`} src={src} alt={`썸네일 ${index + 1}`} onClick={() => setMainSrc(src)} className={active ? 'is-active' : ''} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setMainSrc(src)} />
                     })}
                  </div>
                  {/* 메인 */}
                  <div className="mainitem-img">
                     <img src={mainSrc} alt="대표 이미지" />
                  </div>
               </div>
            </div>

            <div className="item-detail-right">
               <div className="itemdetail-info">
                  <div>
                     {Array.isArray(item.Categories) && item.Categories.length > 0 && <p className="itemdetail-category">{item.Categories.map((c) => `#${c.categoryName} `)}</p>}
                     <h1 className="itemdetail-title">{item.itemNm || '상품명 없음'}</h1>
                  </div>

                  <p className="itemdetail-price">{(Number(item.price) || 0).toLocaleString()} 원</p>

                  {item.itemSummary && <p className="sub-ex">{item.itemSummary}</p>}

                  <div className="quantity-row">
                     <label htmlFor="quantity">수량</label>
                     <input id="quantity" type="number" value={quantity} onChange={handleQuantityChange} min="1" />
                     <p>총 {((Number(item.price) || 0) * quantity).toLocaleString()} 원</p>
                  </div>

                  {item.itemSellStatus === 'SELL' ? (
                     <div className="button-row">
                        <button className="btn-outline cart" type="button" onClick={handleAddToCart}>
                           장바구니
                        </button>
                        <Link to="/order/:id" state={{ item: [{ itemId: item.id, price: Number(item.price) || 0, quantity }] }} className="btn-outline order">
                           구매하기
                        </Link>
                     </div>
                  ) : (
                     <p className="sold-out">품절된 상품입니다.</p>
                  )}
               </div>
            </div>
         </div>
         {/* ↑ top-section 닫힘 */}

         {/* 하단 카드: 리뷰 */}
         <div className={`contents-card detail-card ${openKey === 'review' ? 'is-open' : ''}`}>
            <button type="button" className={`card-header card-header--toggle ${openKey === 'review' ? 'is-open' : ''}`} aria-expanded={openKey === 'review'} aria-controls="panel-review" onClick={() => toggle('review')} id="header-review">
               <div className="window-btn">
                  <span className="red"></span>
                  <span className="green"></span>
                  <span className="blue"></span>
               </div>
               <span className="detail-card-title">
                  상품 리뷰 ({reviewCount}건, 평균 {avgRating})
               </span>
               <svg className="card-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M22 6v2h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1H9v-1H8v-1H7v-1H6v-1H5v-1H4V9H3V8H2V6h2v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h2v-1h1v-1h1v-1h1v-1h1V9h1V8h1V7h1V6z" />
               </svg>
            </button>
            <div id="panel-review" className={`card-panel ${openKey === 'review' ? 'open' : ''}`} role="region" aria-labelledby="header-review">
               <ItemReviewList item={item} avgRating={avgRating} reviewCount={reviewCount} />
            </div>
         </div>

         {/* 하단 카드: 상세 설명 */}
         <div className={`contents-card detail-card ${openKey === 'detail' ? 'is-open' : ''}`}>
            <button type="button" className={`card-header card-header--toggle ${openKey === 'detail' ? 'is-open' : ''}`} aria-expanded={openKey === 'detail'} aria-controls="panel-detail" onClick={() => toggle('detail')} id="header-detail">
               <div className="window-btn">
                  <span className="red"></span>
                  <span className="green"></span>
                  <span className="blue"></span>
               </div>
               <span className="detail-card-title">상세 설명</span>
               <svg className="card-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M22 6v2h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1H9v-1H8v-1H7v-1H6v-1H5v-1H4V9H3V8H2V6h2v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h2v-1h1v-1h1v-1h1v-1h1V9h1V8h1V7h1V6z" />
               </svg>
            </button>
            <div id="panel-detail" className={`card-panel ${openKey === 'detail' ? 'open' : ''}`} role="region" aria-labelledby="header-detail">
               {item.itemDetail ? <p className="main-ex">{item.itemDetail}</p> : <p>상세 설명이 없습니다.</p>}
            </div>
         </div>

         {/* 하단 카드: 상품 문의 */}
         <div className={`contents-card detail-card ${openKey === 'qna' ? 'is-open' : ''}`}>
            <button type="button" className={`card-header card-header--toggle ${openKey === 'qna' ? 'is-open' : ''}`} aria-expanded={openKey === 'qna'} aria-controls="panel-qna" onClick={() => toggle('qna')} id="header-qna">
               <div className="window-btn">
                  <span className="red"></span>
                  <span className="green"></span>
                  <span className="blue"></span>
               </div>
               <span className="detail-card-title">상품 문의</span>
               <svg className="card-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M22 6v2h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1H9v-1H8v-1H7v-1H6v-1H5v-1H4V9H3V8H2V6h2v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h2v-1h1v-1h1v-1h1v-1h1V9h1V8h1V7h1V6z" />
               </svg>
            </button>
            <div id="panel-qna" className={`card-panel ${openKey === 'qna' ? 'open' : ''}`} role="region" aria-labelledby="header-qna">
               <form className="inquiry-form" onSubmit={submitInquiry}>
                  <div className="inquiry-row">
                     <label htmlFor="inq-name">이름</label>
                     <input id="inq-name" name="name" value={inquiry.name} onChange={handleInquiryChange} placeholder="이름(선택)" />
                  </div>
                  <div className="inquiry-row">
                     <label htmlFor="inq-contact">연락처</label>
                     <input id="inq-contact" name="contact" value={inquiry.contact} onChange={handleInquiryChange} placeholder="이메일 또는 전화번호(선택)" />
                  </div>
                  <div className="inquiry-row">
                     <label htmlFor="inq-content">문의 내용</label>
                     <textarea id="inq-content" name="content" value={inquiry.content} onChange={handleInquiryChange} placeholder="상품에 대한 문의를 작성해 주세요." rows={5} required />
                  </div>
                  <div className="inquiry-actions">
                     <label className="checkbox">
                        <input type="checkbox" name="isPrivate" checked={inquiry.isPrivate} onChange={handleInquiryChange} />
                        비공개
                     </label>
                     <button style={{ marginTop: '0px', maxWidth: '200px' }} type="submit" className="btn-outline submit-btn">
                        문의 등록
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </section>
   )
}

export default ItemDetailForm
