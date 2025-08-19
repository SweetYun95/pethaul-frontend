// src/components/order/OrderForm.jsx
import React, { useState } from 'react'
import '../css/order/OrderForm.css'
import { useSelector } from 'react-redux'

function OrderForm({ item, cartItems }) {
  // ===== 공통 유틸 =====
  const toNumber = (n, d = 0) => {
    const v = Number(n)
    return Number.isFinite(v) ? v : d
  }

  // ===== 입력 정규화 =====
  const cartArr = Array.isArray(cartItems) ? cartItems : []
  const itemArr = Array.isArray(item) ? item : (item ? [item] : [])
  const items = cartArr.length ? cartArr : itemArr

  // 합계/수량
  const orderPrice = items.reduce((sum, it) => {
    if (it?.Item) {
      const price = toNumber(it.Item?.price)
      const qty = toNumber(it.count ?? 1, 1)
      return sum + price * qty
    }
    const price = toNumber(it?.price)
    const qty = toNumber(it?.quantity ?? it?.count ?? 1, 1)
    return sum + price * qty
  }, 0)

  const totalCount = items.reduce((sum, it) => {
    if (it?.Item) return sum + toNumber(it.count ?? 1, 1)
    return sum + toNumber(it?.quantity ?? it?.count ?? 1, 1)
  }, 0)

  // ===== 쿠폰/배송 =====
  // allowStack=false: 한 번에 1개만 적용
  const allowStack = false

  const COUPONS = [
    { code: 'WELCOME20', name: '신규가입 20% 쿠폰', type: 'percent', value: 20 },
    { code: 'SAVE5000',  name: '5,000원 즉시할인',  type: 'fixed',   value: 5000 },
    // 필요 시 배송비 무료 쿠폰도 가능 (shippingFree 타입):
    // { code: 'FREESHIP',  name: '배송비 무료 쿠폰', type: 'shippingFree' }
  ]

  // 모달
  const [couponModalOpen, setCouponModalOpen] = useState(false)

  // 선택된 쿠폰 (단일)
  const [selectedCoupon, setSelectedCoupon] = useState(null)

  // 다중 쿠폰도 지원하고 싶다면 selectedCoupons 배열을 쓰면 됨:
  // const [selectedCoupons, setSelectedCoupons] = useState([]);

  const calcDiscountByCoupon = (subtotal, coupon) => {
    if (!coupon) return 0
    if (coupon.type === 'percent') {
      return Math.floor(subtotal * (coupon.value / 100))
    }
    if (coupon.type === 'fixed') {
      return Math.min(subtotal, coupon.value)
    }
    // shippingFree는 할인금액이 아니라 배송비 계산에서 반영
    return 0
  }

  // 단일 쿠폰 적용일 때
  const discount = calcDiscountByCoupon(orderPrice, selectedCoupon)
  const afterDiscount = Math.max(0, orderPrice - discount)

  // 배송비: “할인 후 금액” 기준 3만원 이상 무료
  // shippingFree 쿠폰이 있다면 배송비 0으로 처리
  const hasShippingFree = selectedCoupon?.type === 'shippingFree'
  const shippingFee =
    hasShippingFree ? 0 : afterDiscount >= 30000 ? 0 : afterDiscount > 0 ? 3000 : 0

  const payable = afterDiscount + shippingFee

  // ===== 폼 상태 =====
  const [formData, setFormData] = useState({
    name: '',
    phone1: '',
    phone2: '',
    phone3: '',
    address: '',
    request: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('간편결제')
  const [simplePay, setSimplePay] = useState('')
  const [cardNumber, setCardNumber] = useState({ card0: '', card1: '', card2: '', card3: '' })
  const [expiry, setExpiry] = useState({ expiryMonth: '', expiryYear: '' })
  const [selectedCashMethod, setSelectedCashMethod] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handlePaymentChange = (event, newMethod) => {
    event.preventDefault()
    if (newMethod !== null) setPaymentMethod(newMethod)
  }
  const handleSimplePaySelect = (method) => setSimplePay(method)
  const handleCardNumberChange = (e) => {
    const { name, value } = e.target
    if (!/^\d*$/.test(value)) return
    setCardNumber((prev) => ({ ...prev, [name]: value }))
  }
  const handleExpiryChange = (e) => {
    const { name, value } = e.target
    if (!/^\d*$/.test(value)) return
    setExpiry((prev) => ({ ...prev, [name]: value }))
  }

  // ===== 모달 내부 UI =====
const CouponModal = ({ open, onClose, onSelect, coupons, selected }) => {
  if (!open) return null
  return (
    <div role="dialog" aria-modal="true" className="coupon-modal-backdrop" onClick={onClose}>
      <div className="coupon-modal" onClick={(e) => e.stopPropagation()}>
        <div>
          <span>쿠폰 선택</span>
          <button onClick={onClose} style={{ all: 'unset', fontSize: 18, lineHeight: 1 }}>✕</button>
        </div>

        <div className="coupon-list">
          {coupons.map((c) => {
            const active = selected?.code === c.code
            return (
              <button
                key={c.code}
                onClick={() => onSelect(c)}
                className={`coupon-btn ${active ? 'active' : ''}`}
              >
                <div className="coupon-info">
                  <div>{c.name}</div>
                  <div>코드: {c.code}</div>
                </div>
                {active ? (
                  <span style={{ color: '#4f46e5', fontWeight: 700 }}>선택됨</span>
                ) : (
                  <span>선택</span>
                )}
              </button>
            )
          })}
        </div>

        <div className="coupon-modal-footer">
          {selected && (
            <button className="btn-cancel" onClick={() => onSelect(null)}>
              선택 해제
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

  return (
    <section id="order-section">
      <h1 className="section-title">주문/배송</h1>
      <div className="section-contents">
        {/* 좌측 */}
        <div className="order-left">
          {/* 배송지 입력 */}
          <div className="contents-card">
            <div className="card-header">
              <div className="window-btn">
                <span className="red"></span><span className="green"></span><span className="blue"></span>
              </div>
              <span className="card-title">배송지 입력</span>
            </div>
            <div className="delivery-address">
              <div>
                <p className="sub-title"> 기존배송지 </p>
                <button className="address-btn"> 배송지 변경하기</button>
              </div>
              <form className="address-input-group" onSubmit={(e) => e.preventDefault()}>
                <div className="address-input name">
                  <label>이름 / 배송지명</label>
                  <input type="text" name="name" placeholder="집" value={formData.name} onChange={handleChange} />
                </div>
                <div className="address-input">
                  <label>전화번호</label>
                  <div className="phone-input-group">
                    <input type="text" name="phone1" maxLength="3" value={formData.phone1} onChange={handleChange} />
                    <span className="hyphen">-</span>
                    <input type="text" name="phone2" maxLength="4" value={formData.phone2} onChange={handleChange} />
                    <span className="hyphen">-</span>
                    <input type="text" name="phone3" maxLength="4" value={formData.phone3} onChange={handleChange} />
                  </div>
                </div>
                <div className="address-input">
                  <label>주소</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div className="address-input">
                  <label>배송시 요청사항</label>
                  <select name="request" value={formData.request} onChange={handleChange}>
                    <option value="">선택 안 함</option>
                    <option value="문 앞에 두고 가주세요">문 앞에 두고 가주세요</option>
                    <option value="배송 전 연락주세요">배송 전 연락주세요</option>
                  </select>
                </div>
              </form>
            </div>
          </div>

          {/* 결제수단 */}
          <div className="contents-card">
            <div className="card-header">
              <div className="window-btn">
                <span className="red"></span><span className="green"></span><span className="blue"></span>
              </div>
              <span className="card-title">결제수단</span>
            </div>
            <div className="payment-method">
              <div className="button-group">
                {['간편결제', '카드결제', '현금결제', '휴대폰결제'].map((method) => (
                  <button
                    key={method}
                    className={paymentMethod === method ? 'active' : ''}
                    onClick={(e) => handlePaymentChange(e, method)}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {/* 간편결제 */}
              {paymentMethod === '간편결제' && (
                <div className="simple-payment">
                  {[
                    { label: '토스페이', value: '토스페이', img: '/images/tosspay.png' },
                    { label: '네이버페이', value: '네이버페이', img: '/images/naverpay.png' },
                    { label: '애플페이', value: '애플페이', img: '/images/applepay.png' },
                    { label: '카카오페이', value: '카카오페이', img: '/images/kakaopay.png' },
                  ].map((m) => (
                    <button
                      key={m.value}
                      onClick={(e) => { e.preventDefault(); handleSimplePaySelect(m.value) }}
                      className={simplePay === m.value ? 'active' : ''}
                    >
                      <img src={m.img} alt={m.label} className="pay-icon" />
                      {m.label}
                    </button>
                  ))}
                </div>
              )}

              {/* 카드결제 */}
              {paymentMethod === '카드결제' && (
                <div className="card-payment">
                  <p>카드번호</p>
                  <div className="card-payment-input card-number-wrapper">
                    {['card0', 'card1', 'card2', 'card3'].map((field, index) => (
                      <React.Fragment key={field}>
                        <input type="text" maxLength={4} name={field} placeholder="0000" value={cardNumber[field]} onChange={handleCardNumberChange} className="card-input" />
                        {index < 3 && <span className="hyphen">-</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="card-payment-input expiry-date">
                    <p>만료일</p>
                    <div>
                      <input type="text" maxLength={2} name="expiryMonth" placeholder="MM" value={expiry.expiryMonth} onChange={handleExpiryChange} className="expiry-input" />
                      <span>/</span>
                      <input type="text" maxLength={2} name="expiryYear" placeholder="YY" value={expiry.expiryYear} onChange={handleExpiryChange} className="expiry-input" />
                    </div>
                  </div>
                  <div className="card-payment-input cvc">
                    <p>CVC</p>
                    <input label="CVC" placeholder="123" />
                  </div>
                  <div className="card-payment-input card-password ">
                    <p>비밀번호</p>
                    <input label="비밀번호" placeholder="앞 2자리" />
                  </div>
                </div>
              )}

              {/* 현금결제 */}
              {paymentMethod === '현금결제' && (
                <div className="cash-payment">
                  {['무통장입금', '편의점결제'].map((label) => (
                    <button
                      key={label}
                      onClick={(e) => { e.preventDefault(); setSelectedCashMethod(label) }}
                      className={selectedCashMethod === label ? 'active' : ''}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {/* 휴대폰결제 */}
              {paymentMethod === '휴대폰결제' && (
                <div className="phone-payment">
                  <p>휴대폰 결제를 진행합니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 우측 결제하기 */}
        <div className="contents-card order-right">
          <div className="card-header">
            <div className="window-btn">
              <span className="red"></span><span className="green"></span><span className="blue"></span>
            </div>
            <span className="card-title">결제하기</span>
          </div>

          <div className="order-paying">
            <p className="sub-title">예상 결제금액</p>
            <div className="paying-group">
              <div>
                <p>총 상품금액: </p>
                <p>{orderPrice.toLocaleString()}원</p>
              </div>

              {/* 쿠폰 영역: 모달 트리거 */}
              <div className='coupon-discount'>
                <p>쿠폰할인:</p>
                <div >
                  <button onClick={() => setCouponModalOpen(true)}>쿠폰선택</button>
                  {selectedCoupon && (
                    <div>
                      <p className='coupon'>
                        {selectedCoupon.name} 적용 (-{(discount).toLocaleString()}원)
                      </p>
                      <button className='coupon-delete' onClick={() => setSelectedCoupon(null)} >
                        해제
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p>배송비: </p>
                <p>{shippingFee.toLocaleString()}원</p>
              </div>
            </div>

            <div className="total-sum">
              <p>총 {totalCount}개 주문금액</p>
              <p>{payable.toLocaleString()}원</p>
            </div>

            <button className="order-btn" type="button" onClick={() => alert('결제 처리 로직 연결 예정')}>
              구매하기
            </button>
          </div>
        </div>
      </div>

      {/* 쿠폰 선택 모달 */}
      <CouponModal
        open={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        onSelect={(c) => {
          // 단일 선택 모드: 바로 저장 후 닫기
          if (!allowStack) {
            setSelectedCoupon(c)
            setCouponModalOpen(false)
            return
          }
          // 다중 중복적용 모드로 확장 시 여기서 배열 업데이트
        }}
        coupons={COUPONS}
        selected={selectedCoupon}
      />
    </section>
  )
}

export default OrderForm
