import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cancelOrderThunk, fetchOrdersThunk } from '../features/orderSlice'
import { Link } from 'react-router-dom'
import './css/MyOrderList.css'

function MyOrderList() {
   const dispatch = useDispatch()
   const { orders, loading, error, pagination } = useSelector((state) => state.order)

   const [page, setPage] = useState(1)
   const LIMIT = 10

   // ✅ 페이지 변경 시마다 재요청
   useEffect(() => {
      dispatch(fetchOrdersThunk({ page, limit: LIMIT }))
   }, [dispatch, page])

   const rows = useMemo(() => [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)), [orders])

   const handleOrderCancel = (id) => {
      const res = confirm('정말 주문을 취소하시겠습니까?')
      if (res) {
         dispatch(cancelOrderThunk(id))
            .unwrap()
            .then(() => {
               alert('주문을 취소했습니다.')
               dispatch(fetchOrdersThunk())
            })
            .catch((error) => {
               console.log('주문 취소 중 에러 발생:', error)
               alert('주문 취소 중 에러가 발생했습니다.:' + error)
            })
      }
   }

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러 발생: {error}</p>

   const apiBase = import.meta.env.VITE_APP_API_URL || ''

   return (
      <div className="ribbon-background">
         {rows && (
            <section id="order-section">
               <h1 className="section-title">결제내역</h1>

               <div className="order-list">
                  {rows.map((order) => (
                     <article key={order.id} className="contents-card">
                        <header className="card-header">
                           <div className="window-btn">
                              <span className="red"></span>
                              <span className="green"></span>
                              <span className="blue"></span>
                           </div>
                           <div className="order-date">
                              <p>{order.orderDate?.slice(0, 10) ?? ''}</p>
                           </div>
                        </header>

                        <div className="order-box">
                           <div className="order-items">
                              <div className="order-card-wrap">
                                 {order.Items?.map((item) => {
                                    const imgSrc = apiBase + (item?.ItemImages?.[0]?.imgUrl || '')
                                    return (
                                       <div key={item.id} className="order-card">
                                          <img
                                             src={imgSrc}
                                             alt={item.itemNm}
                                             onError={(e) => {
                                                e.currentTarget.src = '/images/placeholder.png'
                                             }}
                                          />
                                          <div className="order-card-content">
                                             <p className="orderitem-name">{item.itemNm}</p>
                                             <div>
                                                <p className="orderitem-price">{item.OrderItem.orderPrice}원</p>
                                                <p className="orderitem-count">{item.OrderItem.count}개</p>
                                             </div>

                                             <div className="card-buttons">
                                                <button className="btn cart-btn">
                                                   <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 32 32">
                                                      <path
                                                         fill="#000"
                                                         d="M1.52 28.19h1.53v-1.52h4.57v3.05H4.57v1.52h22.86v-1.52h-3.05v-3.05h4.57v1.52h1.53V16H32v-1.52h-4.57v-3.05h-1.52v3.05H6.1v-3.05H4.57v3.05H0V16h1.52ZM24.38 16h4.57v3.05h-4.57Zm0 4.57h4.57v4.58h-4.57ZM16.76 16h6.1v3.05h-6.1Zm0 4.57h6.1v4.58h-6.1Zm0 6.1h6.1v3.05h-6.1ZM9.14 16h6.1v3.05h-6.1Zm0 4.57h6.1v4.58h-6.1Zm0 6.1h6.1v3.05h-6.1ZM3.05 16h4.57v3.05H3.05Zm0 4.57h4.57v4.58H3.05Z"
                                                         strokeWidth={0.5}
                                                         stroke="#000"
                                                      ></path>
                                                      <path fill="#000" d="M27.43 28.19h1.52v1.53h-1.52ZM24.38 8.38h1.53v3.05h-1.53Zm-1.52-3.04h1.52v3.04h-1.52Z" strokeWidth={0.5} stroke="#000"></path>
                                                      <path fill="#000" d="M13.72 5.34v1.52h1.52v1.52h1.52V6.86h1.53V5.34h4.57V3.81h-4.57V2.29h-1.53V.76h-1.52v1.53h-1.52v1.52H9.14v1.53zm-6.1 0h1.52v3.04H7.62ZM6.1 8.38h1.52v3.05H6.1ZM3.05 28.19h1.52v1.53H3.05Z" strokeWidth={0.5} stroke="#000"></path>
                                                   </svg>
                                                   &nbsp;+
                                                </button>
                                                <button className="btn btn-primary">바로구매</button>

                                                {/* 리뷰 버튼: map 내부로 이동 (item 접근 가능) */}
                                                {order.orderStatus !== 'ORDER' && order.orderStatus !== 'CANCEL' && (
                                                   <Link to="/review/create" state={{ item }} className="btn">
                                                      리뷰 작성
                                                   </Link>
                                                )}
                                             </div>
                                          </div>
                                       </div>
                                    )
                                 })}
                              </div>
                              <div className="order-actions">
                                 {order.orderStatus === 'ORDER' && (
                                    <button className="btn btn-danger" onClick={() => handleOrderCancel(order.id)}>
                                       주문 취소
                                    </button>
                                 )}

                                 {order.orderStatus === 'CANCEL' && <p className="cancelled">취소완료</p>}

                                 {/* 여기서는 item을 쓰지 않음 */}
                                 <button className="btn order-detail-btn">주문상세보기</button>
                                 <button className="btn return-btn">교환/반품 신청</button>
                                 <button className="btn delivery-btn">배송조회</button>
                              </div>
                           </div>
                        </div>
                     </article>
                  ))}
               </div>
               {/*  하단 페이지네이션 배치 */}
               <div className="paginator bottom">
                  <button className="btn" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                     이전
                  </button>
                  <span className="page-indicator">
                     {pagination?.currentPage ?? page} / {pagination?.totalPages ?? '-'}
                  </span>
                  <button className="btn" disabled={pagination ? page >= pagination.totalPages : false} onClick={() => setPage((p) => p + 1)}>
                     다음
                  </button>
               </div>
            </section>
         )}
      </div>
   )
}

export default MyOrderList
