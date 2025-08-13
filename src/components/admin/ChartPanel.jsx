import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrdersThunk } from '../../features/orderSlice'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Tabs, Tab, Box, Typography } from '@mui/material'

function CustomTabPanel({ children, value, index }) {
   if (value !== index) return null
   return <Box sx={{ p: 3, height: '500px' }}>{children}</Box>
}

function ChartPanel() {
   const dispatch = useDispatch()
   const { orders, loading, error } = useSelector((state) => state.order)
   useEffect(() => {
      dispatch(fetchAllOrdersThunk())
   }, [dispatch])
   console.log('🎀orders:', orders)
   // useEffect(() => {
   //    dispatch(fetchAllOrdersThunk())
   //       .unwrap()
   //       .then((result) => {
   //          console.log('[💦OrderChart.jsx] result.orders:', result.orders)
   //          const orders = result.orders
   //          const itemMap = {}

   //          orders.forEach((order) => {
   //             const name = order.itemNm
   //             const count = order.count
   //             if (!itemMap[name]) {
   //                itemMap[name] = 0
   //             }
   //             itemMap[name] += count
   //          })
   //          console.log('[💌OrderChart.jsx] itemMap:', itemMap)
   //          //위 객체를 배열로 변환
   //          const itemSummary = Object.entries(itemMap).map(([name, totalCount]) => ({
   //             name,
   //             totalCount,
   //          }))
   //          console.log('[💌OrderChart.jsx] itemSummary:', itemSummary)
   //          setChartData(itemSummary)
   //       })
   //       .catch((error) => {
   //          console.log('에러 발생:', error)
   //          alert('에러가 발생했습니다.:' + error)
   //       })
   // }, [dispatch])

   // 테스트
   const chartData = [
      { category: 'A', value: 100, profit: 20 },
      { category: 'B', value: 80, profit: 15 },
      { category: 'C', value: 50, loss: 10 },
   ]

   // 예: 카테고리 A와 B는 profit을, C는 loss를 사용
   const processedData = chartData.map((item) => {
      if (item.category === 'C') {
         return { ...item, displayValue: item.loss }
      }
      return { ...item, displayValue: item.profit }
   })

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러 발생: {error}</p>
   return (
      <Box sx={{ width: '100%', height: 700 }}>
         <p>확인</p>
         <BarChart width={500} height={300} data={chartData}>
            <Bar
               dataKey="value"
               shape={(props) => {
                  const { category } = props.payload
                  if (category === 'C') {
                     return <rect {...props} fill="red" /> // 카테고리 C는 빨간색
                  }
                  return <rect {...props} fill="green" />
               }}
            />
         </BarChart>
      </Box>
   )
}

export default ChartPanel
