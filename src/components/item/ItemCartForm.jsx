// src/components/item/ItemCartForm.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'

import { fetchCartItemsThunk, updateCartItemThunk, deleteCartItemThunk } from '../../features/cartSlice'
import '../css/item/ItemCartForm.css'

/* ===== detail 수량 카운터 이식 ===== */
function QtyCounter({ value, min = 1, max = 99, onChange }) {
  const [val, setVal] = useState(value)

  // 외부 값이 바뀌면 동기화
  useEffect(() => { setVal(value) }, [value])

  const clamp = (n) => Math.min(Math.max(min, Math.floor(Number(n) || min)), max)

  const commit = (n) => {
    const next = clamp(n)
    setVal(next)
    onChange?.(next)
  }

  const dec = () => commit(val - 1)
  const inc = () => commit(val + 1)

  const onInputChange = (e) => setVal(e.target.value)
  const onBlur = () => commit(val)

  const onKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); onBlur() }
    if (e.key === 'ArrowUp') { e.preventDefault(); inc() }
    if (e.key === 'ArrowDown') { e.preventDefault(); dec() }
  }

  return (
    <div className="qty-control" role="group" aria-label="수량 선택">
      <button
        type="button"
        className="qty-btn"
        onClick={dec}
        disabled={clamp(val) <= min}
        aria-label="수량 감소"
      >−</button>

      <input
        className="qty-input"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={val}
        onChange={onInputChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onWheel={(e) => e.currentTarget.blur()}
        aria-live="polite"
      />

      <button
        type="button"
        className="qty-btn"
        onClick={inc}
        disabled={clamp(val) >= max}
        aria-label="수량 증가"
      >+</button>
    </div>
  )
}
/* ================================== */

const ItemCartForm = () => {
  const dispatch = useDispatch()
  const { items: cartItems = [], loading } = useSelector((state) => state.cart)
  const { id } = useParams()

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

  const totalPrice = useMemo(
    () => cartItems.reduce((acc, item) => acc + (item.count || 0) * (item.Item?.price || 0), 0),
    [cartItems]
  )
  const discount = 3000 // 예시 쿠폰 할인
  const finalPrice = Math.max(0, totalPrice - discount)

  return (
    <section id="itemCart-section">
      <div className="cart-contents">
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

          {!loading && cartItems.length === 0 && (
            <div className="empty">장바구니가 비었습니다.</div>
          )}

          {!loading && cartItems.map((item) => {
            const repImage = item.Item?.ItemImages?.find((img) => img.repImgYn === 'Y')?.imgUrl || '/images/no-image.jpg'
            const imgSrc = buildImgUrl(repImage)
            const price = item.Item?.price || 0
            const name = item.Item?.itemNm || '상품명'
            const qty = item.count ?? 1
            const itemId = item.Item?.id

            // detail과 동일하게 재고 상한 적용 (없으면 99)
            const maxQty = (() => {
              const stock = Number(item.Item?.stockNumber ?? item.Item?.stock ?? 0)
              return Number.isFinite(stock) && stock > 0 ? stock : 99
            })()

            return (
              <div className="cart-card" key={`${item.id}-${item.Item?.id || 'na'}`}>
                <button
                  type="button"
                  className="del-btn"
                  onClick={() => handleDelete(itemId)}
                  aria-label="삭제"
                  title="삭제"
                >x</button>

                <div className="thumb">
                  <img src={imgSrc} alt={name} />
                </div>

                <div className="info">
                  <p className="cartitem-name" title={name}>{name}</p>

                  <div>
                    <div className="qty-row">
                      {/* ✅ detail 수량 카운터 그대로 사용 */}
                      <QtyCounter
                        value={qty}
                        min={1}
                        max={maxQty}
                        onChange={(next) => handleUpdate(itemId, next)}
                      />
                    </div>

                    {/* 단가 or 소계 중 택1 (현재는 단가 표기) */}
                    <p className="cartitem-price">{price.toLocaleString()}원</p>
                    {/* 소계를 보고 싶다면 아래로 교체:
                    <p className="cartitem-price">{(price * qty).toLocaleString()}원</p>
                    */}

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
              <button className="submit-btn" disabled={cartItems.length === 0}>
                주문하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ItemCartForm
