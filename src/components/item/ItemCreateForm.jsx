import { Box } from '@mui/material'
import '../css/ItemCreateForm.css'

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
      <section id="itemCreate-section">
         <h1 className="section-title">상품 등록</h1>
         <div className="contents-card">
            <div className="card-header">
               <div className="window-btn">
                  <span className="red"></span>
                  <span className="green"></span>
                  <span className="blue"></span>
               </div>
               <span className="card-title">상품정보를 입력해주세요.</span>
            </div>
            <div className="item-create-form-group">
               <form encType="multipart/form-data">
                  {/* 이미지 업로드 필드 */}
                  <button className="img-up-btn" component="label">
                     이미지 업로드 (최대 5개)
                     <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 32 32">
                        <path fill="#000" d="M27.425 6.09h-1.52V4.57h-1.52V3.04h-1.53V1.52h-1.52V0H3.045v32h25.91V7.62h-1.53Zm0 24.38H4.575V1.52h15.23v7.62h7.62Z" strokeWidth={0.1} stroke="#000"></path>
                        <path fill="#000" d="M19.805 19.81v-1.53h-1.52v1.53h-9.14v-1.53h-1.53V7.62h-1.52v16.76h1.52v-3.05h16.77v3.05h1.52V10.66h-1.52v7.62h-1.53v1.53z" strokeWidth={1} stroke="#000"></path>
                        <path
                           fill="#000"
                           d="M7.615 24.38h16.77v1.52H7.615Zm13.72-7.62h1.52v1.52h-1.52Zm-3.05-1.52h3.05v1.52h-3.05Zm-1.52 1.52h1.52v1.52h-1.52Zm-1.53-1.52h1.53v1.52h-1.53Zm-3.04-1.53h3.04v1.53h-3.04Zm-1.53 1.53h1.53v1.52h-1.53Zm-1.52 1.52h1.52v1.52h-1.52Zm0-7.62h3.05v3.05h-3.05Zm-1.53-3.05h9.15v1.53h-9.15Z"
                           strokeWidth={1}
                           stroke="#000"
                        ></path>
                     </svg>
                     <input type="file" name="img" accept="image/*" hidden multiple onChange={handleImageChange} />
                  </button>

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

                  <div className="input-group">
                     {/* 상품명 입력 필드 */}
                     <div className="item-input-section item-name">
                        <p>상품명</p>
                        <input label="상품명" value={itemNm} onChange={(e) => setItemNm(e.target.value)} placeholder="상품명을 입력해주세요." maxLength={15} />
                     </div>

                     {/* 가격 입력 필드 */}
                     <div className="item-input-section item-price">
                        <p>가격</p>
                        <input
                           value={formatWithComma(price)} // 콤마 추가된 값 표시
                           onChange={handlePriceChange} // 입력 핸들러
                           placeholder="가격을 입력해주세요."
                           maxLength={10}
                        />
                     </div>

                     {/* 재고 입력 필드 */}
                     <div className="item-input-section item-amount">
                        <p>재고/수량</p>
                        <input label="재고수량" value={stockNumber} onChange={handleStockChange} placeholder="수량을 입력해주세요." maxLength={10} />
                     </div>

                     {/* 상품 카테고리 입력 필드 */}
                     <div className="item-input-section item-category">
                        <p>상품 카테고리</p>
                        <input label="상품 카테고리 (#로 구분)" placeholder="상품 카테고리" value={inputCategory} onChange={(e) => setInputCategory(e.target.value)} />
                     </div>

                     {/* 판매 상태 선택 필드 */}
                     <div className="item-input-section">
                        <label htmlFor="item-sell-status" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                           판매 상태
                        </label>
                        <select id="item-sell-status" value={itemSellStatus} onChange={(e) => setItemSellStatus(e.target.value)}>
                           <option value="SELL">판매중</option>
                           <option value="SOLD_OUT">품절</option>
                        </select>
                     </div>
                  </div>

                  {/* 상품 요약 입력 필드 */}
                  <div className="item-input-section">
                     <p>상품 요약 (500자 미만)</p>
                     <textarea className="item-create-input item-summary" label="상품 요약 (500자 미만)" placeholder="상품 요약 (500자 미만)" value={itemSummary} onChange={(e) => setItemSummary(e.target.value)} />
                  </div>

                  {/* 상품설명 입력 필드 */}
                  <div className="item-input-section">
                     <p>상품 설명</p>
                     <textarea className="item-create-input item-detail" label="상품설명" placeholder="상품설명을 작성해주세요." value={itemDetail} onChange={(e) => setItemDetail(e.target.value)} />
                  </div>

                  {/* 등록 버튼 */}
                  <button className="submit-btn" type="submit">
                     등록하기
                  </button>
               </form>
            </div>
         </div>
      </section>
   )
}

export default ItemCreateForm
