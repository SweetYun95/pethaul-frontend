// src/components/order/OrderForm.jsx
import React, { useState } from 'react'
import '../css/order/OrderForm.css'
import { useSelector } from 'react-redux'

function OrderForm({ item, cartItems }) {
   console.log('🎈item:', item, '🎈cartItems:', cartItems)
   const { user } = useSelector((state) => state.auth)
   console.log('🎈user:', user)

   let orderPrice = 0
   if (cartItems) {
      orderPrice = cartItems.reduce((sum, cart) => {
         return sum + cart.Item.price * (cart.count || 1)
      }, 0)
   } else {
      orderPrice = item[0]?.price * item[0]?.quantity
   }
   console.log('🎈orderPrice:', orderPrice)
   const [formData, setFormData] = useState({
      name: user?.name,
      phone1: '',
      phone2: '',
      phone3: '',
      address: '',
      request: '',
   })
   const [paymentMethod, setPaymentMethod] = useState('간편결제')
   const [simplePay, setSimplePay] = useState('')
   const [cardNumber, setCardNumber] = useState({
      card0: '',
      card1: '',
      card2: '',
      card3: '',
   })
   const [expiry, setExpiry] = useState({
      expiryMonth: '',
      expiryYear: '',
   })
   const [selectedCashMethod, setSelectedCashMethod] = useState('')

   const handleChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }))
   }

   const handlePaymentChange = (event, newMethod) => {
      if (newMethod !== null) {
         setPaymentMethod(newMethod)
      }
   }
   const handleSimplePaySelect = (method) => {
      setSimplePay(method)
   }

   //카드결제 카드번호
   const handleCardNumberChange = (e) => {
      const { name, value } = e.target
      if (!/^\d*$/.test(value)) return // 숫자만
      setCardNumber((prev) => ({
         ...prev,
         [name]: value,
      }))
   }

   // 카드결제 유효일
   const handleExpiryChange = (e) => {
      const { name, value } = e.target
      if (!/^\d*$/.test(value)) return
      setExpiry((prev) => ({
         ...prev,
         [name]: value,
      }))
   }

   return (
      <section id="order-section">
         <h1 className="section-title">주문/배송</h1>
         <div className="section-contents">
            {/* 좌측 */}
            <div className="left">
               {/* 배송지 입력 */}
               <div className="contents-card">
                  <div className="card-header">
                     <div className="window-btn">
                        <span className="red"></span>
                        <span className="green"></span>
                        <span className="blue"></span>
                     </div>
                     <span className="card-title">배송지 입력</span>
                  </div>
                  <div className="delivery-address">
                     <div>
                        <p className="sub-title"> 기존배송지 </p>
                        <button className="address-btn"> 배송지 변경하기</button>
                     </div>
                     <form className="address-input-group">
                        <div className="address-input name">
                           <label>이름 / 배송지명</label>
                           <input type="text" name="name" placeholder="집" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="address-input">
                           <label>전회번호</label>
                           <div className="phone-input-group">
                              <input type="text" maxLength="3" value={formData.phone1} onChange={handleChange} />
                              <span className="hyphen">-</span>
                              <input type="text" maxLength="4" value={formData.phone2} onChange={handleChange} />
                              <span className="hyphen">-</span>
                              <input type="text" maxLength="4" value={formData.phone3} onChange={handleChange} />
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
                        <span className="red"></span>
                        <span className="green"></span>
                        <span className="blue"></span>
                     </div>
                     <span className="card-title">결제수단</span>
                  </div>
                  <div className="payment-method">
                     <div className="button-group">
                        {['간편결제', '카드결제', '현금결제', '휴대폰결제'].map((method) => (
                           <button key={method} className={paymentMethod === method ? 'active' : ''} onClick={(e) => handlePaymentChange(e, method)}>
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
                           ].map((method) => (
                              <button key={method.value} onClick={() => handleSimplePaySelect(method.value)} className={simplePay === method.value ? 'active' : ''}>
                                 <img src={method.img} alt={method.label} className="pay-icon" />
                                 {method.label}
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
                              <button key={label} onClick={() => setSelectedCashMethod(label)} className={selectedCashMethod === label ? 'active' : ''}>
                                 {' '}
                                 {label}{' '}
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
            <div className="contents-card right">
               <div className="card-header">
                  <div className="window-btn">
                     <span className="red"></span>
                     <span className="green"></span>
                     <span className="blue"></span>
                  </div>
                  <span className="card-title">결제하기</span>
               </div>

               <div className="order-paying">
                  <p className="sub-title">예상 결제금액</p>
                  <div className="paying-group">
                     <div>
                        <p>총 상품금액: </p>
                        <p>{orderPrice}원</p>
                     </div>
                     <div>
                        <p>상품할인: </p>
                        <p>-00,000원</p>
                     </div>
                     <div>
                        <p>쿠폰할인:</p>
                        <button>쿠폰선택</button>
                     </div>
                     <div>
                        <p>배송비: </p>
                        <p>0,000원</p>
                     </div>
                  </div>
                  <div className="total-sum">
                     <p>총 0개 주문금액</p>
                     <p>00,000원</p>
                  </div>
                  <button className="order-btn" type="submit">
                     구매하기
                  </button>
               </div>
            </div>
         </div>
      </section>
   )
}

export default OrderForm
