import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { useState } from 'react'
import { formatWithComma, stripComma } from '../../utils/priceSet'

function ItemCreateForm({ onCreateSubmit }) {
   const [imgUrls, setImgUrls] = useState([]) // 이미지 경로(여러개 저장)
   const [imgFiles, setImgFiles] = useState([]) // 이미지 파일 객체(여러개 저장)
   const [itemNm, setItemNm] = useState('') // 상품명
   const [price, setPrice] = useState('') // 가격
   const [stockNumber, setStockNumber] = useState('') // 재고
   const [itemSellStatus, setItemSellStatus] = useState('SELL') // 판매상태
   const [itemDetail, setItemDetail] = useState('') // 상품설명
   const [itemSummary, setItemSummary] = useState('') // 상품 요약 (간단한 설명)
   const [inputCategory, setInputCategory] = useState('')

   // 이미지 미리보기
   const handleImageChange = (e) => {
      const files = e.target.files // 업로드된 모든 파일 객체 가져오기
      if (!files || files.length === 0) return // 파일이 없거나 파일길이가 0이면 함수 종료

      const newFiles = Array.from(files).slice(0, 5)
      console.log(newFiles)

      setImgFiles(newFiles)

      // 미리보기

      const newImgUrls = newFiles.map((file) => {
         const reader = new FileReader()
         reader.readAsDataURL(file)

         return new Promise((resolve) => {
            reader.onload = (event) => {
               resolve(event.target.result)
            }
         })
      })

      Promise.all(newImgUrls).then((urls) => {
         setImgUrls(urls)
      })
   }

   // 상품 등록
   const handleSubmit = (e) => {
      e.preventDefault()

      if (!itemNm.trim()) {
         alert('상품명을 입력하세요!')
         return
      }

      if (!String(price).trim()) {
         alert('가격을 입력하세요!')
         return
      }

      if (!String(stockNumber).trim()) {
         alert('재고를 입력하세요.')
         return
      }

      if (imgFiles.length === 0) {
         alert('이미지 최소 1개 이상 업로드 하세요.')
         return
      }

      const formData = new FormData()
      formData.append('itemNm', itemNm)
      formData.append('price', price)
      formData.append('stockNumber', stockNumber)
      formData.append('itemSellStatus', itemSellStatus)
      formData.append('itemDetail', itemDetail)
      formData.append('itemSummary', itemSummary)

      // 이미지 파일 여러개 인코딩 처리(한글 파일명 깨짐 방지) 및 formData에 추가
      imgFiles.forEach((file) => {
         const encodedFile = new File([file], encodeURIComponent(file.name), { type: file.type })
         formData.append('img', encodedFile)
      })

      // 카테고리 입력값 배열 형태로 변경
      const categories = inputCategory
         .split('#')
         .map((c) => c.trim())
         .filter((c) => c !== '')
      formData.append('categories', JSON.stringify(categories))

      // 상품등록 함수 실행
      onCreateSubmit(formData)
   }

   const handlePriceChange = (e) => {
      const rawValue = e.target.value
      const numericValue = stripComma(rawValue)

      // 숫자가 아닌 값이 입력되면 리턴(유효성 체크)
      const isNumric = /^\d*$/
      if (!isNumric.test(numericValue)) return

      setPrice(numericValue)
   }

   // 재고입력시 숫자만 입력하도록
   const handleStockChange = (e) => {
      const rawValue = e.target.value

      // 숫자가 아닌 값이 입력되면 리턴(유효성 체크)
      const isNumric = /^\d*$/
      if (!isNumric.test(rawValue)) return

      setStockNumber(rawValue)
   }

   return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} encType="multipart/form-data">
         {/* 이미지 업로드 필드 */}
         <Button variant="contained" component="label">
            이미지 업로드 (최대 5개)
            <input type="file" name="img" accept="image/*" hidden multiple onChange={handleImageChange} />
         </Button>

         {/* 업로드된 이미지 미리보기 */}
         <Box
            display="flex"
            flexWrap="wrap"
            gap={2}
            mt={2}
            sx={{
               justifyContent: 'flex-start',
            }}
         >
            {imgUrls.map((url, index) => (
               <Box
                  key={index}
                  sx={{
                     width: '120px',
                     height: '120px',
                     border: '1px solid #ccc',
                     borderRadius: '8px',
                     overflow: 'hidden',
                     display: 'flex',
                     justifyContent: 'center',
                     alignItems: 'center',
                  }}
               >
                  <img src={url} alt={`업로드 이미지 ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               </Box>
            ))}
         </Box>

         {/* 상품명 입력 필드 */}
         <TextField label="상품명" variant="outlined" fullWidth value={itemNm} onChange={(e) => setItemNm(e.target.value)} placeholder="상품명" sx={{ mt: 2 }} inputProps={{ maxLength: 15 }} />

         {/* 가격 입력 필드 */}
         <TextField
            label="가격"
            variant="outlined"
            fullWidth
            value={formatWithComma(price)} // 콤마 추가된 값 표시
            onChange={handlePriceChange} // 입력 핸들러
            placeholder="가격"
            sx={{ mt: 2 }}
            inputProps={{ maxLength: 10 }}
         />

         {/* 재고 입력 필드 */}
         <TextField label="재고수량" variant="outlined" fullWidth value={stockNumber} onChange={handleStockChange} placeholder="재고수량" sx={{ mt: 2 }} inputProps={{ maxLength: 10 }} />

         {/* 판매 상태 선택 필드 */}
         <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="item-sell-status-label">판매 상태</InputLabel>
            <Select labelId="item-sell-status-label" label="판매상태" value={itemSellStatus} onChange={(e) => setItemSellStatus(e.target.value)}>
               {/* value는 실제 items 테이블의 itemSellStatus 컬럼에 저장될 값 */}
               <MenuItem value="SELL">판매중</MenuItem>
               <MenuItem value="SOLD_OUT">품절</MenuItem>
            </Select>
         </FormControl>

         {/* 상품 카테고리 입력 필드 */}
         <TextField label="상품 카테고리 (#로 구분)" variant="outlined" fullWidth value={inputCategory} onChange={(e) => setInputCategory(e.target.value)} sx={{ mt: 2 }} />

         {/* 상품 요약 입력 필드 */}
         <TextField label="상품 요약 (500자 미만)" variant="outlined" fullWidth multiline rows={2} value={itemSummary} onChange={(e) => setItemSummary(e.target.value)} sx={{ mt: 2 }} />

         {/* 상품설명 입력 필드 */}
         <TextField label="상품설명" variant="outlined" fullWidth multiline rows={4} value={itemDetail} onChange={(e) => setItemDetail(e.target.value)} sx={{ mt: 2 }} />

         {/* 등록 버튼 */}
         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            등록하기
         </Button>
      </Box>
   )
}

export default ItemCreateForm
