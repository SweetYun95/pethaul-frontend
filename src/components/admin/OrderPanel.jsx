// src/components/admin/OrderPanel.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrdersThunk, updateOrderStatusThunk, cancelOrderThunk } from '../../features/orderSlice'

import "../css/admin/OrderPanel.css"

function OrderPanel() {
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector((state) => state.order)
  const [statusValue, setStatusValue] = useState({})

  useEffect(() => {
    if (Array.isArray(orders)) {
      const initialStatus = {}
      orders.forEach((o) => { initialStatus[o.id] = o.orderStatus })
      setStatusValue(initialStatus)
    }
  }, [orders])

  useEffect(() => {
    dispatch(fetchAllOrdersThunk())
  }, [dispatch])

  const handleStatusChange = (orderId, value) => {
    setStatusValue((prev) => ({ ...prev, [orderId]: value }))
  }

  const handleUpdateStatus = (orderId) => {
    const res = confirm('정말 수정하시겠습니까?')
    if (!res) return
    dispatch(updateOrderStatusThunk({ orderId, status: statusValue[orderId] }))
      .unwrap()
      .then(() => {
        alert(`주문id: ${orderId} 건의 주문상태를 ${statusValue[orderId]}로 변경했습니다!`)
        dispatch(fetchAllOrdersThunk())
      })
      .catch((err) => {
        console.log('에러 발생: ', err)
        alert('에러가 발생했습니다.: ' + err)
      })
  }

  const handleOrderCancel = (id) => {
    const res = confirm('정말 주문을 취소하시겠습니까?')
    if (!res) return
    dispatch(cancelOrderThunk(id))
      .unwrap()
      .then(() => {
        alert('주문을 취소했습니다.')
        dispatch(fetchAllOrdersThunk())
      })
      .catch((err) => {
        console.log('주문 취소 중 에러 발생:', err)
        alert('주문 취소 중 에러가 발생했습니다.:' + err)
      })
  }

  if (loading) return <p>로딩 중...</p>
  if (error) return <p>에러 발생: {error}</p>

  return (
    <div className="order-panel">
      {Array.isArray(orders) && orders.map((order) => (
        <div className="order-panel-card" key={order.id}>
         <div className='order-panel-card__list'>
          <div className="order-col order-panel-id">
            <p><span>ID:</span>{order.id}</p>
          </div>
         <div className="order-col order-panel-items">
            <p><span>주문상품</span><br/>{order.itemNm /* TODO: 실제 상품 리스트로 교체 */}</p>
          </div>

          <div className="order-col order-panel-info">
            <p><span>주문일자</span><br/>{order.orderDate?.slice(0, 10)}</p>
            <p><span>주문자</span><br/>{order.User?.name}</p>
            <p><span>주문자 id</span><br/>{order.User?.userId}</p>
            <p><span>주소</span><br/>{order.User?.address}</p>
          </div>
         </div>


          <div className="order-col order-panel-actions">
            {order.orderStatus === 'CANCEL' ? (
              <p className="order-cancelled">취소 완료</p>
            ) : (
              <>
                <label className="visually-hidden" htmlFor={`status-${order.id}`}>주문 상태</label>
                <select
                  id={`status-${order.id}`}
                  value={statusValue[order.id] || 'ORDER'}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="ORDER">ORDER</option>
                  <option value="READY">READY</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
                 <div>
                <button type="button" className="btn primary" onClick={() => handleUpdateStatus(order.id)}>
                  수정
                </button>
                <button type="button" className="btn danger" onClick={() => handleOrderCancel(order.id)}>
                  취소
                </button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderPanel
