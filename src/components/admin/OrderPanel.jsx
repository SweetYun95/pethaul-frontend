// src/components/admin/OrderPanel.jsx
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrdersThunk, updateOrderStatusThunk, cancelOrderThunk } from '../../features/orderSlice'
import AdminFilterForm from './AdminFilterForm'
import '../css/admin/AdminCards.css'

function OrderPanel() {
   const dispatch = useDispatch()
   const { orders = [], loading, error } = useSelector((s) => s.order)
   const [statusValue, setStatusValue] = useState({})
   // 공용 필터 폼과 동일한 UX
   const [q, setQ] = useState('')
   const [status, setStatus] = useState('all') // all|ORDER|READY|SHIPPED|DELIVERED|CANCEL

   useEffect(() => {
      dispatch(fetchAllOrdersThunk())
   }, [dispatch])

   console.log('🎈🎈🎈🎈🎈', orders)
   // 최초 로드/변경 시 셀렉트 박스 초기화
   useEffect(() => {
      if (Array.isArray(orders)) {
         const initialStatus = {}
         orders.forEach((o) => {
            initialStatus[o.id] = o.orderStatus
         })
         setStatusValue(initialStatus)
      }
   }, [orders])

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

   // 클라이언트 필터링
   const filtered = useMemo(() => {
      return (orders || []).filter((o) => {
         const statusOk = status === 'all' ? true : o.orderStatus === status
         const text = `${o?.itemNm ?? ''} ${o?.User?.name ?? ''} ${o?.User?.userId ?? ''} ${o?.id ?? ''}`.toLowerCase()
         const qOk = q ? text.includes(q.toLowerCase()) : true
         return statusOk && qOk
      })
   }, [orders, q, status])

   const onSearch = (e) => {
      e.preventDefault()
      // 서버 쿼리 필요 없어서 아무 것도 안 해도 됨 (필터 상태가 이미 반영됨)
   }
   const onReset = () => {
      setQ('')
      setStatus('all')
   }

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러 발생: {String(error)}</p>

   return (
      <div>
         <AdminFilterForm
            title="주문 관리"
            statusOptions={[
               { value: 'all', label: '전체' },
               { value: 'ORDER', label: 'ORDER' },
               { value: 'READY', label: 'READY' },
               { value: 'SHIPPED', label: 'SHIPPED' },
               { value: 'DELIVERED', label: 'DELIVERED' },
               { value: 'CANCEL', label: 'CANCEL' },
            ]}
            tagOptions={null}
            values={{ q, status }}
            onChange={{ setQ, setStatus }}
            onSearch={onSearch}
            onReset={onReset}
         />

         <div className="admin-cards">
            {filtered.map((order) => (
               <div className="admin-card" key={order?.id}>
                  <div className="admin-card__list">
                     <div className="admin-id">
                        <span>ID</span>
                        {order?.id}
                     </div>

                     <div className="admin-items">
                        <div className="cell-title">{order?.itemNm || '주문상품'}</div>
                        <div className="admin-meta">
                           주문일자 {order?.orderDate?.slice(0, 10)} · 상태 {order?.orderStatus}
                        </div>
                     </div>

                     <div className="admin-info">
                        <div className="admin-kv">
                           <span>주문자</span>
                           {order?.User?.name || '-'}
                        </div>
                        <div className="admin-kv">
                           <span>아이디</span>
                           {order?.User?.userId || '-'}
                        </div>
                        <div className="admin-kv">
                           <span>주소</span>
                           {order?.User?.address || '-'}
                        </div>
                     </div>
                  </div>

                  <div className="admin-card__actions">
                     {order?.orderStatus === 'CANCEL' ? (
                        <p className="admin-badge-cancel">취소 완료</p>
                     ) : (
                        <>
                           <label className="visually-hidden" htmlFor={`status-${order?.id}`}>
                              주문 상태
                           </label>
                           <select id={`status-${order?.id}`} value={statusValue[order?.id] || 'ORDER'} onChange={(e) => handleStatusChange(order?.id, e.target.value)}>
                              <option value="ORDER">ORDER</option>
                              <option value="READY">READY</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                              <option value="CANCEL">CANCEL</option>
                           </select>

                           <div className="admin-actions-row">
                              <button type="button" className="btn primary" onClick={() => handleUpdateStatus(order?.id)}>
                                 수정
                              </button>
                              <button type="button" className="btn danger" onClick={() => handleOrderCancel(order?.id)}>
                                 취소
                              </button>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            ))}

            {!filtered.length && !loading && <div className="admin-meta">데이터가 없습니다.</div>}
         </div>
      </div>
   )
}

export default OrderPanel
