// src/components/myInfo/OrderState.jsx
import '../css/myInfo/OrderState.css'
import React from 'react'

function OrderState({ order }) {
   const baseURL = import.meta.env.VITE_APP_API_URL || ''

   // 안전 가드: 주문이 없거나 Items가 비어있는 경우
   const items = Array.isArray(order?.Items) ? order.Items : []
   const firstItem = items[0]

   // 대표 이미지 경로
   const imgUrl = firstItem?.ItemImages?.[0]?.imgUrl ? (/^https?:\/\//i.test(firstItem.ItemImages[0].imgUrl) ? firstItem.ItemImages[0].imgUrl : `${baseURL}${firstItem.ItemImages[0].imgUrl}`) : '/images/placeholder.png'

   const itemName = firstItem?.itemNm ?? '상품 정보 없음'
   const price = firstItem?.price != null ? `${firstItem.price}원` : '가격 정보 없음'
   const orderDate = order?.orderDate ? order.orderDate.slice(0, 10) : '주문일자 정보 없음'
   const orderStatus = order?.orderStatus ?? null

   const EmptyState = () => (
      <section id="order-state">
         <div className="contents-card top">
            <div className="card-header">
               <div className="window-btn">
                  <span className="red"></span>
                  <span className="green"></span>
                  <span className="blue"></span>
               </div>
               <span className="card-title">주문현황</span>
            </div>
            <div className="order-empty">
               <p>최근 주문이 없습니다.</p>
            </div>
         </div>
      </section>
   )

   // 주문 데이터가 없으면 빈 상태 반환
   if (!order || items.length === 0) return <EmptyState />

   return (
      <section id="order-state">
         <div className="contents-card top">
            <div className="card-header">
               <div className="window-btn">
                  <span className="red"></span>
                  <span className="green"></span>
                  <span className="blue"></span>
               </div>
               <span className="card-title">주문현황</span>
            </div>

            <div className='summary-state' >
               <img src={imgUrl} alt="주문 상품 이미지" width="100px" />
               <div>
                  <p>상품명: {itemName}</p>
                  <p>가격: {price}</p>
                  <p>주문일자: {orderDate}</p>
               </div>
            </div>

            {order.length === 0 && <p>주문 내역이 없습니다.</p>}
            {order.length > 1 && orderStatus === 'CANCEL' ? (

               <p>취소된 주문입니다.</p>
            ) : (
               <div className="order-state-details">
                  <div className={`order-step ${orderStatus === 'ORDER' ? 'active' : ''}`}>
                     <p>판매자확인</p>
                     <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 32 32">
                        <path
                           fill="#000"
                           d="M29.715 12.955h1.52v6.09h-1.52Zm-19.81 0h1.52v-1.53h1.53v-1.52h6.09v1.52h1.53v-1.52h4.57v1.52h1.52v12.19h1.53v-3.04h1.52v-1.53h-1.52v-6.09h1.52v-1.53h-1.52v-6.09h-1.53v1.52h-1.52v-1.52h-3.05v-1.53h-10.67v1.53h-1.52v1.52h-1.52v3.05h-1.53v-4.57h-1.52v4.57h-1.52v1.52h6.09z"
                           strokeWidth={1}
                           stroke="#000"
                        ></path>
                        <path
                           fill="#000"
                           d="M25.145 23.615h1.52v1.53h-1.52Zm0-19.81h1.52v1.53h-1.52Zm-1.53 16.77h1.53v1.52h-1.53Zm0-4.58h1.53v3.05h-1.53Zm0-13.71h1.53v1.52h-1.53Zm-12.19 22.86V28.2h-3.04v1.52h-3.05v1.52h24.38v-1.52h-3.05V28.2h-3.05v-1.53h1.53v-1.52Zm10.67 4.57h-6.09V28.2h-3.05v-1.53H22.1Zm-3.05-7.62h4.57v1.52h-4.57Zm0-3.05h1.53v1.53h-1.53Zm0-6.09h1.53v1.52h-1.53Zm-1.52 4.57h1.52v1.52h-1.52Zm0-3.05h1.52v1.53h-1.52Zm-1.53 1.53h1.53v1.52h-1.53ZM3.05 1.52h15.24v1.53H3.05ZM1.52 28.95h1.53v1.53H1.52Zm0-25.9h1.53v1.52H1.52ZM0 4.57h1.52v24.38H0Z"
                           strokeWidth={1}
                           stroke="#000"
                        ></path>
                     </svg>
                     <p>
                        확인완료
                        <br />곧 준비해드릴게요!
                     </p>
                  </div>

                  <div className={`order-step ${orderStatus === 'READY' ? 'active' : ''}`}>
                     <p>상품준비중</p>
                     <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 32 32">
                        <path
                           fill="#000"
                           d="M28.95 8.385h1.53v1.52h-1.53Zm-1.52 1.52h1.52v1.52h-1.52Zm-1.53 9.14v1.53h3.05v-3.05h-1.52v1.52zm0-3.05h1.53v1.53H25.9Zm0-4.57h1.53v1.53H25.9Zm0-4.57h3.05v1.53H25.9Zm-3.04 13.72h3.04v1.52h-3.04Zm0-6.1h1.52v1.52h1.52v-3.04h-3.04zm0-9.14h3.04v1.52h-3.04Zm-1.53 6.09h1.53v1.53h-1.53Zm-1.52-7.62h3.05v1.53h-3.05Zm0 16.77h-1.52v-1.53h-1.53v-1.52h-3.05v1.52h1.53v7.62h-1.53v1.53h3.05v-1.53h3.05v-1.52h3.05v-3.05h-3.05zm0-6.1h3.05v1.52h-3.05Zm-1.52-4.57h3.04v1.52h-3.04Zm0-4.57h1.52v1.52h-1.52Zm-1.53 10.66h3.05v1.53h-3.05Zm1.53-6.09v-3.05h-1.53v1.53h-1.52v-1.53h-1.53v3.05z"
                           strokeWidth={1}
                           stroke="#000"
                        ></path>
                        <path
                           fill="#000"
                           d="M10.67 25.145h3.04v1.52h-3.04Zm1.52-6.1h1.52v1.53h-1.52Zm-1.52-3.05h3.04v1.53h-3.04Zm0-6.09h3.04v1.52h-3.04Zm1.52-4.57h1.52v1.52h-1.52Zm-1.52 15.24h1.52v1.52h-1.52ZM9.14 3.805h3.05v1.53H9.14Zm-1.52 18.29h3.05v3.05H7.62Zm0-7.62h3.05v1.52H7.62Zm0-3.05h3.05v1.53H7.62ZM6.1 5.335h3.04v1.52H6.1Zm-1.53 15.24h3.05v1.52H4.57Zm1.53-7.62h1.52v1.52H6.1Zm-1.53 1.52H6.1v1.52H4.57Zm0-3.05H6.1v1.53H4.57Zm-1.52-4.57H6.1v1.53H3.05Zm1.52 12.19H3.05v-1.52H1.52v3.05h3.05zm-1.52-3.05h1.52v1.53H3.05Zm0-6.09h1.52v1.52H3.05Zm-1.53-1.52h1.53v1.52H1.52Z"
                           strokeWidth={1}
                           stroke="#000"
                        ></path>
                     </svg>
                     <a> 운송장조회하기 </a>
                  </div>

                  <div className={`order-step ${orderStatus === 'SHIPPED' ? 'active' : ''}`}>
                     <p>배송중</p>
                     <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 32 32">
                        <path
                           fill="#000"
                           d="M30.48 16.765v-1.53h-1.53v-1.52h-1.52v-1.53h-1.52v3.05h-1.53v1.53h-1.52v-4.58h3.05v-1.52h-7.62v-1.52h-1.53v10.66H1.53v-4.57H0v10.67h1.53v-4.57h15.23v4.57h-6.09v-1.53H9.14v4.58h1.53v-1.53h9.14v1.53h1.53v-4.58h-1.53v1.53h-1.52v-13.72h3.05v6.1h1.52v1.52h7.62v6.1H32v-9.14z"
                           strokeWidth={1}
                           stroke="#000"
                        ></path>
                        <path
                           fill="#000"
                           d="M27.43 24.375h-1.52v4.58h1.52v-1.53h3.05v-1.52h-3.05zm-6.09 4.58h4.57v1.52h-4.57Zm1.52-3.05h1.52v1.52h-1.52Zm-1.52-3.05h4.57v1.52h-4.57Zm-7.62-16.76v6.09h-1.53v1.53h3.05v-9.14h-3.05v1.52zm-4.58 0h3.05v1.52H9.14Zm0 10.67v-1.53h3.05v-1.52H9.14v-6.1H6.1v1.53h1.52v6.09H6.1v1.53zm0-13.72h3.05v1.53H9.14Zm-4.57 19.81h4.57v1.52H4.57ZM6.1 1.525h3.04v1.52H6.1Zm-1.53 27.43h4.57v1.52H4.57Zm1.53-3.05h1.52v1.52H6.1Zm-3.05-12.19H6.1v1.52H3.05Zm0-10.67H6.1v1.53H3.05Zm1.52 21.33H3.05v1.53H1.53v1.52h1.52v1.53h1.52zM3.05 6.095H6.1v1.52H3.05Zm-1.52 6.09v-6.09h1.52v-1.52H0v9.14h3.05v-1.53z"
                           strokeWidth={1}
                           stroke="#000"
                        ></path>
                     </svg>
                     <a>배송상세확인</a>
                  </div>

                  <div className={`order-step ${orderStatus === 'DELIVERED' ? 'active' : ''}`}>
                     <p>배송완료</p>
                     <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 32 32">
                        <path
                           fill="#000"
                           d="M7.62 29.715h12.19v1.52H7.62Zm12.19-1.52h4.57v1.52h-4.57Zm-4.57-1.53v-1.52H4.57v1.52h1.52v3.05h1.53v-3.05zm-9.15-4.57v-1.52H1.52v1.52h1.52v3.05h1.53v-3.05zm6.1-1.52v-1.53h3.05v-1.52h-3.05v-7.62H9.14v1.52h1.52v7.62H9.14v1.53zm-6.1-3.05h3.05v1.52H6.09Zm-6.09 0h1.52v3.05H0Zm15.24-1.52h3.04v1.52h-3.04Zm-12.2 0h3.05v1.52H3.04Zm0-7.62h3.05v-1.53H3.04v-1.52H1.52v10.67h1.52zM27.43 9.9v1.52H25.9v1.53h1.53v13.71h-3.05v1.54h3.05v1.52H32V9.9Zm3.04 16.76h-1.52v-3.05h1.52Z"
                           strokeWidth={1}
                           stroke="#000"
                        ></path>
                        <path
                           fill="#000"
                           d="M24.38 9.905h1.52v1.52h-1.52Zm-3.05-1.52h3.05v1.52h-3.05Zm-9.14 0h3.05v1.52h-3.05Zm-4.57-1.53v1.53H6.09v1.52h3.05v-3.05zm7.62 0v1.53h3.04v7.62h1.53V5.335h-1.53v1.52zm-6.1-1.52h3.05v1.52H9.14Zm6.1-1.52h3.04v1.52h-3.04Zm-1.53 1.52v-1.52h1.53v-1.53h-3.05v3.05zM3.04 3.815h3.05v1.52H3.04Zm3.05-1.53h3.05v1.53H6.09ZM9.14.765h3.05v1.52H9.14Z"
                           strokeWidth={1}
                           stroke="#000"
                        ></path>
                     </svg>
                     <p>
                        배송완료
                        <br />
                        되었습니다!
                     </p>
                  </div>
               </div>
            )}
         </div>
      </section>
   ) : (
      <section id="order-state">
         <div className="contents-card top">
            <div className="card-header">
               <div className="window-btn">
                  <span className="red"></span>
                  <span className="green"></span>
                  <span className="blue"></span>
               </div>
               <span className="card-title">주문현황</span>
            </div>
            <div>
               <p>주문 내역이 존재하지 않습니다.</p>
            </div>
         </div>
      </section>
   )
}

export default OrderState