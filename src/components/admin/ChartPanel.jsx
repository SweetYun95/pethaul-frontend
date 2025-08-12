import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrdersThunk } from '../../features/orderSlice'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Box, Typography } from '@mui/material'

function ChartPanel() {
   const dispatch = useDispatch()
   const { loading, error } = useSelector((state) => state.order)
   const [chartData, setChartData] = useState([])

   useEffect(() => {
      dispatch(fetchAllOrdersThunk())
         .unwrap()
         .then((result) => {
            console.log('[💦OrderChart.jsx] result.orders:', result.orders)
            const orders = result.orders
            const itemMap = {}

            orders.forEach((order) => {
               const name = order.itemNm
               const count = order.count
               if (!itemMap[name]) {
                  itemMap[name] = 0
               }
               itemMap[name] += count
            })
            console.log('[💌OrderChart.jsx] itemMap:', itemMap)
            //위 객체를 배열로 변환
            const itemSummary = Object.entries(itemMap).map(([name, totalCount]) => ({
               name,
               totalCount,
            }))
            console.log('[💌OrderChart.jsx] itemSummary:', itemSummary)
            setChartData(itemSummary)
         })
         .catch((error) => {
            console.log('에러 발생:', error)
            alert('에러가 발생했습니다.:' + error)
         })
   }, [dispatch])

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러 발생: {error}</p>
   return (
      <Box sx={{ width: '100%', height: 700 }}>
         <Typography variant="h6">상품별 주문 건수</Typography>
         <ResponsiveContainer width="100%" height="100%">
            <LineChart
               width={500}
               height={300}
               data={chartData}
               margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
               }}
            >
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="name" />
               <YAxis />
               <Tooltip />
               <Legend />
               <Line type="monotone" dataKey="totalCount" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
         </ResponsiveContainer>
      </Box>
   )
}

export default ChartPanel
