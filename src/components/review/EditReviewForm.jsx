import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../css/CreateReviewForm.css'
import { updateReviewThunk } from '../../features/reviewSlice'
import { useNavigate } from 'react-router-dom'

function EditReviewForm({ id, review }) {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   // ⭐ 별점 상태
   const [hover, setHover] = useState(0)
   const [rating, setRating] = useState(review.rating)

   // 이미지 & 내용
   const [reviewImages, setReviewImages] = useState([]) // File[]
   const [imgUrls, setImgUrls] = useState([]) // string[]
   const [reviewContent, setReviewContent] = useState(review.reviewContent)

   // ⭐ 별 아이콘 (SVG)
   const FilledStar = (
      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={18} viewBox="0 0 24 24" aria-hidden="true">
         <path fill="#ffbf00" d="M23 8v2h-1v1h-1v1h-1v1h-1v1h-1v5h1v4h-2v-1h-2v-1h-2v-1h-2v1H9v1H7v1H5v-4h1v-5H5v-1H4v-1H3v-1H2v-1H1V8h7V6h1V4h1V2h1V1h2v1h1v2h1v2h1v2z" strokeWidth={1.2} stroke="#000"></path>
      </svg>
   )
   const EmptyStar = (
      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={18} viewBox="0 0 24 24">
         <path fill="#000" d="M16 8V6h-1V4h-1V2h-1V1h-2v1h-1v2H9v2H8v2H1v2h1v1h1v1h1v1h1v1h1v5H5v4h2v-1h2v-1h2v-1h2v1h2v1h2v1h2v-4h-1v-5h1v-1h1v-1h1v-1h1v-1h1V8zm4 3h-1v1h-1v1h-1v1h-1v5h1v1h-2v-1h-2v-1h-2v1H9v1H7v-1h1v-5H7v-1H6v-1H5v-1H4v-1h4V9h1V8h1V6h1V4h2v2h1v2h1v1h1v1h4z"></path>
      </svg>
   )
   // 등록한 이미지 미리보기
   const handleImageChange = (e) => {
      const files = e.target.files
      if (!files || files.length === 0) return
      const newFiles = Array.from(files).slice(0, 4)
      setReviewImages(newFiles)

      const newImgUrl = newFiles.map((file) => {
         const reader = new FileReader()
         reader.readAsDataURL(file)
         return new Promise((resolve) => {
            reader.onload = (data) => resolve(data.target.result)
         })
      })
      Promise.all(newImgUrl).then(setImgUrls)
      // 같은 파일 다시 선택 가능하게 초기화
      e.target.value = ''
   }

   const onReviewSubmit = (formData, id) => {
      dispatch(updateReviewThunk({ formData, id }))
         .unwrap()
         .then(() => {
            alert('후기를 수정했습니다!')
            navigate('/')
         })
         .catch((error) => {
            console.error('후기 등록 에러:', error)
            alert('후기 등록에 실패했습니다. ' + error)
         })
   }

   const handleSubmit = (e) => {
      e.preventDefault()

      if (!rating) {
         alert('별점을 선택해 주세요.')
         return
      }
      if (!reviewContent.trim()) {
         alert('후기 입력란에 내용을 작성해 주세요.')
         return
      }

      const formData = new FormData()
      formData.append('reviewContent', reviewContent.trim())
      formData.append('rating', String(rating))
      formData.append('itemId', String(review.Item.id))
      formData.append('reviewDate', new Date().toISOString())
      console.log('formData:', JSON.stringify(formData))

      reviewImages.forEach((file) => {
         const encodedFile = new File([file], encodeURIComponent(file.name), { type: file.type })
         formData.append('img', encodedFile)
      })
      console.log('formData:', JSON.stringify(formData))

      onReviewSubmit(formData, id)
   }
   console.log('🎈id:', id)
   console.log('🎈review:', review)
   return (
      <section id="review-section">
         <h1 className="section-title">리뷰 수정</h1>
         <div className="contents-card">
            <div className="card-header">
               <div className="window-btn">
                  <span className="red"></span>
                  <span className="green"></span>
                  <span className="blue"></span>
               </div>
               <span className="card-title">리뷰를 작성해주세요.</span>
            </div>
            <div className="create-review">
               <h1 className="review-title">'{review.Item.itemNm}'에 대해 얼마나 만족하시나요?</h1>
               <form onSubmit={handleSubmit}>
                  {/* ⭐ 별점 */}
                  <div className="rating" aria-label="별점 선택">
                     {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} type="button" className={`star ${(hover || rating) >= n ? 'on' : ''}`} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)} aria-label={`${n}점`}>
                           {(hover || rating) >= n ? FilledStar : EmptyStar}
                        </button>
                     ))}
                     <span className="rating-label">{rating > 0 ? `${rating}/5` : '\u2190 별점을 선택해 주세요'}</span>
                  </div>

                  {/* 리뷰 내용 */}
                  <textarea className="review-input" placeholder="여기에 리뷰를 작성하세요. (최소 1자)" value={reviewContent} onChange={(e) => setReviewContent(e.target.value)} rows={5} />

                  {/* 이미지 미리보기 */}
                  <div className="preview-row" style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                     {imgUrls.map((url, index) => (
                        <div
                           key={index}
                           style={{
                              width: 120,
                              height: 120,
                              borderRadius: 8,
                              overflow: 'hidden',
                              border: '1px solid #e5e5e5',
                           }}
                        >
                           <img src={url} alt={`리뷰 이미지 ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                     ))}
                  </div>

                  {/* 파일 업로드 */}
                  <label className="upload-btn">
                     사진 등록
                     <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 32 32">
                        <path fill="#000" d="M30.48 16.76h-1.53v1.52h1.53v7.62H32V6.09h-1.52z" strokeWidth={1} stroke="#000"></path>
                        <path
                           fill="#000"
                           d="M28.95 25.9h1.53v1.53h-1.53Zm0-21.33h1.53v1.52h-1.53Zm-1.52 7.62h1.52v1.52h-1.52ZM13.72 27.43V25.9h-3.05v1.53H3.05v1.52h25.9v-1.52zm12.19-10.67h-1.53v-1.52h-4.57v1.52h-1.52v1.52h-3.05v1.53h3.05v1.52h1.52v1.52h3.05v-1.52h3.05v-1.52h3.04v-1.53h-3.04zm0-3.05h1.52v1.53h-1.52Zm-4.57-3.05h1.52v3.05h-1.52Zm-4.58 12.19h3.05v1.53h-3.05Zm0-9.14h1.53v1.53h-1.53Zm-1.52-1.52h1.52v1.52h-1.52Zm-1.52 12.19h3.04v1.52h-3.04Zm-1.53-7.62h3.05v1.52h-3.05Zm-4.57-1.52h4.57v1.52H7.62Zm-3.05 1.52h3.05v1.52H4.57ZM3.05 3.05h25.9v1.52H3.05Zm0 15.23h1.52v1.53H3.05ZM1.53 25.9h1.52v1.53H1.53Zm0-21.33h1.52v1.52H1.53Zm0 16.76h1.52v-1.52H1.53V6.09H0V25.9h1.53z"
                           strokeWidth={1}
                           stroke="#000"
                        ></path>
                     </svg>
                     <input type="file" name="img" accept="image/*" hidden multiple onChange={handleImageChange} />
                  </label>

                  {/* 제출 */}
                  <button type="submit" className="submit-btn">
                     수정하기
                  </button>
               </form>
            </div>
         </div>
      </section>
   )
}

export default EditReviewForm
