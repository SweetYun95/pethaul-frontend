import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrdersThunk } from '../../features/orderSlice'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import '../css/admin/ChartPanel.css'

function ChartPanel() {
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector((state) => state.order)
  const [sort, setSort] = useState('salesCount')

  useEffect(() => {
    dispatch(fetchAllOrdersThunk(sort))
  }, [dispatch, sort])

  // 주문일자 shortDate로 변환 (차트용)
  const groupedOrders = Object.values(
    orders.reduce((acc, cur) => {
      const dateKey = cur.orderDate.slice(0, 10)
      if (!acc[dateKey]) {
        acc[dateKey] = { shortDate: dateKey, orderPrice: 0, orderCount: 0 }
      }
      acc[dateKey].orderPrice += cur.orderPrice || 0
      acc[dateKey].orderCount += cur.count || 0
      return acc
    }, {})
  )

  // 차트 라벨
  const labelMap = {
    count: '판매량',
    orderCount: '주문 건수',
    orderPrice: '매출액',
  }
  const legendFormatter = (value) => labelMap[value] || value

  if (loading) return <p>로딩 중...</p>
  if (error) return <p>에러 발생: {error}</p>

  return (
    <section id='chart-panel-section'>
      <h1 className='admin-section-title'>매출 차트</h1>
    <div className="chart-panel">
      {/* 버튼 영역 */}
      <div className="chart-buttons">
  <button
    className={sort === 'salesCount' ? 'active' : ''}
    aria-pressed={sort === 'salesCount'}
    onClick={() => setSort('salesCount')}
  >
    전체 판매 데이터
  </button>

  <button
    className={sort === 'orderDate' ? 'active' : ''}
    aria-pressed={sort === 'orderDate'}
    onClick={() => setSort('orderDate')}
  >
    최근 1개월 판매 추이
  </button>

  <button
    className={sort === 'yesterday' ? 'active' : ''}
    aria-pressed={sort === 'yesterday'}
    onClick={() => setSort('yesterday')}
  >
    전일자 판매 추이
  </button>
</div>


      {/* 차트 영역 */}
   <div className="charts-grid">
      <div className="chart-card">
      <h3>상품 판매량</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={orders}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="itemNm" />
            <YAxis />
            <Tooltip />
            <Legend formatter={legendFormatter} />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>

      <div className="chart-card">
      <h3>주문 건수</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={orders}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="itemNm" />
            <YAxis />
            <Tooltip />
            <Legend formatter={legendFormatter} />
            <Bar dataKey="orderCount" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>

      <div className="chart-card">
      <h3>일자별 매출액</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={groupedOrders}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="shortDate" />
            <YAxis />
            <Tooltip />
            <Legend formatter={legendFormatter} />
            <Bar dataKey="orderPrice" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>

     </div>
    </div>
    </section>
  )
}

export default ChartPanel
