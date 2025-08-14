import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'
import { fetchItemsThunk } from '../../features/itemSlice'
import { Box } from '@mui/system'
import { Button, Typography } from '@mui/material'
function ItemSearchTap() {
   const dispatch = useDispatch()
   const { items, loading, error } = useSelector((state) => state.item)

   const [sellCategory, setSellCategory] = useState([]) // 검색 필터 설정 (배열)

   useEffect(() => {
      dispatch(fetchItemsThunk({ sellCategory }))
   }, [dispatch, sellCategory]) // sellCategory 변경될 때마다 useEffect 실행

   // 선택한 값 sellCategory 배열에 추가, 재선택시 삭제
   const handleSelect = (value) => {
      setSellCategory((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
   }

   const CustomButton = ({ value }) => (
      <Button variant={sellCategory.includes(value) ? 'contained' : 'outlined'} onClick={() => handleSelect(value)}>
         {value}
      </Button>
   )

   // 데이터 확인용 로그(배포 전 주석포함 삭제)
   console.log('🎀items:', items)
   console.log('🎀sellCategory:', sellCategory)

   if (error) return <p>에러 발생:{error}</p>

   return (
      <>
         <Box sx={{ marginTop: '200px' }}>
            {/* 클릭시 선택값 초기화 */}
            <Button onClick={() => setSellCategory('')} variant="outlined">
               전체
            </Button>
            <Box>
               <Typography>반려동물</Typography>
               <CustomButton value="강아지" />
               <CustomButton value="고양이" />
               <CustomButton value="햄스터" />
               <CustomButton value="고슴도치" />
               <CustomButton value="토끼" />
               <CustomButton value="새(앵무새)" />
               <CustomButton value="물고기/기타동물" />
            </Box>
            <Box>
               <Typography>추천</Typography>
               <CustomButton value="무료배송" />
               <CustomButton value="이벤트" />
               <CustomButton value="SEASON" />
               <CustomButton value="빠른배송" />
               <CustomButton value="기획전" />
               <CustomButton value="이월상품" />
            </Box>
            <Box>
               <Typography>카테고리</Typography>
               <CustomButton value="사료" />
               <CustomButton value="간식" />
               <CustomButton value="의류" />
               <CustomButton value="산책용품" />
               <CustomButton value="장난감" />
               <CustomButton value="배변용품" />
               <CustomButton value="기타용품" />
            </Box>
         </Box>
      </>
   )
}

export default ItemSearchTap
