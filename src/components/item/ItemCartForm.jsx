// src/components/item/ItemCartForm.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { fetchCartItemsThunk, updateCartItemThunk, deleteCartItemThunk } from '../../features/cartSlice'
import { createOrderThunk } from '../../features/orderSlice'
import '../css/item/ItemCartForm.css'

/* ===== 수량 카운터 ===== */
function QtyCounter({ value, min = 1, max = 99, onChange }) {
   const [val, setVal] = useState(value)
   useEffect(() => {
      setVal(value)
   }, [value])

   const clamp = (n) => Math.min(Math.max(min, Math.floor(Number(n) || min)), max)
   const commit = (n) => {
      const next = clamp(n)
      setVal(next)
      onChange?.(next)
   }

   const dec = () => commit((Number(val) || 0) - 1)
   const inc = () => commit((Number(val) || 0) + 1)

   return (
      <div className="qty-control" role="group" aria-label="수량 선택">
         <button type="button" className="qty-btn" onClick={dec} disabled={clamp(val) <= min} aria-label="수량 감소">
            −
         </button>
         <input
            className="qty-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={() => commit(val)}
            onKeyDown={(e) => {
               if (e.key === 'Enter') {
                  e.preventDefault()
                  commit(val)
               }
               if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  inc()
               }
               if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  dec()
               }
            }}
            onWheel={(e) => e.currentTarget.blur()}
            aria-live="polite"
         />
         <button type="button" className="qty-btn" onClick={inc} disabled={clamp(val) >= max} aria-label="수량 증가">
            +
         </button>
      </div>
   )
}

const toInt = (v, fallback = 0) => {
   const n = Number(v)
   return Number.isFinite(n) ? n : fallback
}

// 서버가 자동으로 카트를 비우지 않으면 true
const CLEAR_CART_AFTER_ORDER = true

const ItemCartForm = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const { items: cartItems = [], loading } = useSelector((state) => state.cart)
   const user = useSelector((state) => state.auth.user)
   const userId = user?.id

   const [submitting, setSubmitting] = useState(false)

   useEffect(() => {
      if (userId) dispatch(fetchCartItemsThunk(userId))
   }, [dispatch, userId])

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

   // 총액(단가 * 수량 합)
   const totalPrice = useMemo(() => cartItems.reduce((acc, ci) => acc + toInt(ci.Item?.price, 0) * Math.max(1, toInt(ci.count, 1)), 0), [cartItems])

   const handleSubmitOrder = async () => {
      if (submitting || cartItems.length === 0) return

      const items = cartItems.map((ci) => ({
         itemId: ci.itemId ?? ci.Item?.id,
         price: Math.max(0, toInt(ci.Item?.price, 0)), // 단가
         quantity: Math.max(1, toInt(ci.count, 1)), // 수량
      }))

      const orderData = { items } // 서버가 userId/orderDate/orderStatus 처리

      try {
         setSubmitting(true)
         console.log('[ORDER payload]', orderData)
         const res = await dispatch(createOrderThunk(orderData))

         if (res.meta.requestStatus === 'fulfilled') {
            const orderId = res.payload?.orderId ?? res.payload?.order?.id ?? res.payload?.id
            // 필요 시 장바구니 비우기/재조회
            await dispatch(fetchCartItemsThunk(user?.id))
            navigate(orderId ? `/order/${orderId}` : '/order/complete')
         } else {
            alert(res.payload || '주문 실패')
         }
      } catch (e) {
         console.error(e)
         alert('주문 처리 중 오류가 발생했습니다.')
      } finally {
         setSubmitting(false)
      }
   }
   return (
      <section id="itemCart-section">
         <div className="cart-contents">
            {/* 좌측: 장바구니 리스트 */}
            <div className="cart-list">
               <h2 className="cart-title">장바구니</h2>

               {loading && (
                  <div className="skeleton-list">
                     {Array.from({ length: 3 }).map((_, i) => (
                        <div className="skeleton-card" key={`sk-${i}`}>
                           <div className="skeleton img" />
                           <div className="skeleton text w60" />
                           <div className="skeleton text w40" />
                        </div>
                     ))}
                  </div>
               )}

               {!loading && cartItems.length === 0 && <div className="empty">장바구니가 비었습니다.</div>}

               {!loading &&
                  cartItems.map((item, idx) => {
                     const product = item.Item
                     const itemId = item.itemId ?? product?.id
                     const name = product?.itemNm || '상품명'
                     const repImage = product?.ItemImages?.find((img) => img.repImgYn === 'Y')?.imgUrl || '/images/no-image.jpg'
                     const imgSrc = buildImgUrl(repImage)
                     const price = toInt(product?.price, 0)
                     const qty = Math.max(1, toInt(item.count, 1))

                     const maxQty = (() => {
                        const stock = Number(product?.stockNumber ?? product?.stock ?? 0)
                        return Number.isFinite(stock) && stock > 0 ? stock : 99
                     })()

                     return (
                        <div className="cart-card" key={`${item.id ?? itemId}-${idx}`}>
                           <button type="button" className="del-btn" onClick={() => handleDelete(itemId)} aria-label="삭제" title="삭제">
                              x
                           </button>

                           <div className="thumb">
                              <img src={imgSrc} alt={name} />
                           </div>

                           <div className="info">
                              <p className="cartitem-name" title={name}>
                                 {name}
                              </p>
                              <div>
                                 <div className="qty-row">
                                    <QtyCounter value={qty} min={1} max={maxQty} onChange={(next) => handleUpdate(itemId, next)} />
                                 </div>
                                 {/* 단가만 표기 (소계/쿠폰 제거) */}
                                 <p className="cartitem-price">{price.toLocaleString()}원</p>
                              </div>
                           </div>
                        </div>
                     )
                  })}
            </div>

            {/* 우측: 결제 요약 */}
            <div className="contents-card">
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
                     <div className="divider" />
                     <div className="total-sum">
                        <p>총 결제 금액</p>
                        <p>{totalPrice.toLocaleString()}원</p>
                     </div>
                     <button type="button" className="submit-btn" onClick={handleSubmitOrder} disabled={submitting || cartItems.length === 0}>
                        {submitting ? '처리 중…' : '주문하기'}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export default ItemCartForm
