import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'

import { fetchCartItemsThunk, updateCartItemThunk, deleteCartItemThunk } from '../../features/cartSlice'
import '../css/item/ItemCartForm.css'

const ItemCartForm = () => {
   const dispatch = useDispatch()
   const { items: cartItems = [], loading } = useSelector((state) => state.cart)
   const { id } = useParams()

   console.log(
      'item:',
      cartItems.map((item) => {
         return item
      })
   )

   useEffect(() => {
      dispatch(fetchCartItemsThunk(id))
   }, [dispatch, id])

   const buildImgUrl = (url) => {
      if (!url) return '/images/no-image.jpg'
      if (/^https?:\/\//i.test(url)) return url
      const base = (import.meta.env.VITE_APP_API_URL || '').replace(/\/+$/, '')
      const path = String(url).replace(/^\/+/, '')
      return `${base}/${path}`
   }

   const handleUpdate = (itemId, count) => {
      const n = Number(count)
      if (!Number.isFinite(n) || n < 1) return
      dispatch(updateCartItemThunk({ itemId, count: n }))
   }

   const handleDelete = (itemId) => {
      dispatch(deleteCartItemThunk(itemId))
   }

   const totalPrice = useMemo(() => cartItems.reduce((acc, item) => acc + (item.count || 0) * (item.Item?.price || 0), 0), [cartItems])
   const discount = 3000 // 예시 쿠폰 할인
   const finalPrice = Math.max(0, totalPrice - discount)

   const orderData = {
      price: finalPrice,
   }

   return (
      <section id="itemCart-section">
         <div className="section-contents">
            {/* 좌측: 장바구니 리스트 */}
            <div className="cart-list left">
               <h2 className="cart-title">장바구니</h2>

               {loading && (
                  <div className="skeleton-list">
                     {Array.from({ length: 3 }).map((_, i) => (
                        <div className="skeleton-card" key={i}>
                           <div className="skeleton img" />
                           <div className="skeleton text w60" />
                           <div className="skeleton text w40" />
                        </div>
                     ))}
                  </div>
               )}

               {!loading && cartItems.length === 0 && <div className="empty">장바구니가 비었습니다.</div>}

               {!loading &&
                  cartItems.map((item) => {
                     const repImage = item.Item?.ItemImages?.find((img) => img.repImgYn === 'Y')?.imgUrl || '/images/no-image.jpg'
                     const imgSrc = buildImgUrl(repImage)
                     const price = item.Item?.price || 0
                     const name = item.Item?.itemNm || '상품명'
                     const qty = item.count ?? 1
                     const itemId = item.Item?.id
                     return (
                        <div className="cart-card" key={`${item.id}-${item.Item?.id || 'na'}`}>
                           <div className="thumb">
                              <img src={imgSrc} alt={name} />
                           </div>
                           <div className="info">
                              <p className="name" title={name}>
                                 {name}
                              </p>
                              <p className="price">{price.toLocaleString()}원</p>

                              <div className="qty-row">
                                 <button type="button" className="qty-btn" onClick={() => handleUpdate(itemId, qty - 1)} aria-label="수량 감소">
                                    −
                                 </button>
                                 <input type="number" min={1} className="qty-input" value={qty} onChange={(e) => handleUpdate(itemId, e.target.value)} />
                                 <button type="button" className="qty-btn" onClick={() => handleUpdate(itemId, qty + 1)} aria-label="수량 증가">
                                    +
                                 </button>

                                 <button type="button" className="del-btn" onClick={() => handleDelete(itemId)} aria-label="삭제" title="삭제">
                                    {/* 간단한 휴지통 아이콘 (SVG) */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
                                       <path fill="#000" d="M22 3v2H2V3h6V2h1V1h6v1h1v1zM4 7v15h1v1h14v-2h1V7zm12 12h-2V9h2zm-6 0H8V9h2z" strokeWidth={0.5} stroke="#000"></path>
                                    </svg>
                                 </button>
                              </div>
                           </div>
                        </div>
                     )
                  })}
            </div>

            {/* 우측: 결제 요약 */}
            <div className="contents-card right">
               <div className="card-header">
                  <div className="window-btn">
                     <span className="red"></span>
                     <span className="green"></span>
                     <span className="blue"></span>
                  </div>
                  <span className="card-title">결제하기</span>
               </div>

               <div className="cart-summary">
                  <p className="sub-title">예상 결제금액</p>
                  <div className="paying-group">
                     <div>
                        <p>상품 금액</p>
                        <p>{totalPrice.toLocaleString()}원</p>
                     </div>
                     <div>
                        <p>쿠폰 할인</p>
                        <p>-{discount.toLocaleString()}원</p>
                     </div>
                     <div className="divider" />
                     <div className="total-sum">
                        <p>총 결제 금액</p>
                        <p>{finalPrice.toLocaleString()}원</p>
                     </div>
                     <Link to="/order" state={{ cartItems }}>
                        <button className="submit-btn" disabled={cartItems.length === 0}>
                           주문하기
                        </button>
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export default ItemCartForm
