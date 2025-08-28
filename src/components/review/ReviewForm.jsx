// src/components/review/ReviewForm.jsx
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createReviewThunk, updateReviewThunk } from '../../features/reviewSlice'
import '../css/review/ReviewForm.css'

/**
 * 통합 리뷰 폼
 * props:
 *  - mode: 'create' | 'edit'
 *  - item: 생성 모드에서 필요한 상품 객체 { id, itemNm }
 *  - review: 수정 모드에서 필요한 리뷰 객체 { id, rating, reviewContent, Item:{ id, itemNm }, ... }
 *  - reviewId: (선택) 수정 모드에서 id 별도 전달 시
 *  - onSuccess: 성공 시 이동 경로 (기본: '/myreviewlist')
 *  - existingImgs: 수정 시 서버에 이미 등록된 이미지 URL 배열(선택)
 */
export default function ReviewForm({
  mode = 'create',
  item,
  review,
  reviewId,
  onSuccess = '/myreviewlist',
  existingImgs = [],
}) {
  const isEdit = mode === 'edit'
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const itemName = isEdit ? review?.Item?.itemNm : item?.itemNm
  const itemId = isEdit ? review?.Item?.id : item?.id
  const initialRating = isEdit ? Number(review?.rating ?? 0) : 0
  const initialContent = isEdit ? (review?.reviewContent ?? '') : ''

  // 상태
  const [hover, setHover] = useState(0)
  const [rating, setRating] = useState(initialRating)
  const [reviewContent, setReviewContent] = useState(initialContent)

  // 새로 첨부하는 이미지 & 미리보기
  const [reviewImages, setReviewImages] = useState([])   // File[]
  const [imgUrls, setImgUrls] = useState(existingImgs)   // string[]
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' }) // 'error' | 'success'

  // SVG
  const Star = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={18} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill={filled ? '#ffbf00' : '#000'}
        stroke="#000"
        strokeWidth={filled ? 1.2 : 0}
        d="M23 8v2h-1v1h-1v1h-1v1h-1v1h-1v5h1v4h-2v-1h-2v-1h-2v-1h-2v1H9v1H7v1H5v-4h1v-5H5v-1H4v-1H3v-1H2v-1H1V8h7V6h1V4h1V2h1V1h2v1h1v2h1v2h1v2z"
      />
    </svg>
  )

  // 파일 변경 -> 미리보기 생성
  const handleImageChange = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files).slice(0, 4)
    setReviewImages(newFiles)

    const urlPromises = newFiles.map((file) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      return new Promise((resolve) => {
        reader.onload = (data) => resolve(data.target.result)
      })
    })

    Promise.all(urlPromises).then((urls) => {
      // 기존 서버 이미지 미리보기(existings) + 새로 선택한 이미지 미리보기 결합
      setImgUrls((prev) => [...existingImgs, ...urls])
    })

    // 같은 파일 다시 선택 가능하게 초기화
    e.target.value = ''
  }

  // 제출
  const handleSubmit = (e) => {
     console.log('🟡 onSubmit fired', { submitting, itemId, rating, reviewContentLen: reviewContent.length });
    e.preventDefault()
    if (submitting) return

    // 검증
    if (!itemId) {
      setMessage({ type: 'error', text: '상품 정보가 없습니다.' })
      return
    }
    if (!rating) {
      setMessage({ type: 'error', text: '별점을 선택해 주세요.' })
      return
    }
    if (!reviewContent.trim()) {
      setMessage({ type: 'error', text: '후기 내용을 입력해 주세요.' })
      return
    }

    setSubmitting(true)
    setMessage({ type: '', text: '' })

    const formData = new FormData()
    formData.append('reviewContent', reviewContent.trim())
    formData.append('rating', String(rating))
    formData.append('itemId', String(itemId))
    formData.append('reviewDate', new Date().toISOString())

    // 새로 추가한 이미지만 전송 (서버 저장본은 서버 쪽 정책에 맞게 별도 처리 필요)
    reviewImages.forEach((file) => {
      const encoded = new File([file], encodeURIComponent(file.name), { type: file.type })
      formData.append('img', encoded)
    })

    const run = isEdit
      ? dispatch(updateReviewThunk({ formData, id: reviewId ?? review?.id }))
      : dispatch(createReviewThunk(formData))

    run
      .unwrap()
      .then(() => {
        setMessage({ type: 'success', text: isEdit ? '후기를 수정했습니다.' : '후기를 작성했습니다.' })
        navigate(onSuccess, { replace: true })
      })
      .catch((err) => {
        console.error('리뷰 저장 에러:', err)
        setMessage({ type: 'error', text: `처리 중 문제가 발생했습니다. ${err}` })
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <section id="review-section">
      <h1 className="section-title">{isEdit ? '리뷰 수정' : '리뷰 작성'}</h1>

      <div className="contents-card">


        <div className="create-review">
          <h1 className="review-title">
            {'\''}{itemName}{'\''}에 대해 얼마나 만족하시나요?
          </h1>

          {/* 상태 메시지 */}
          {message.text && (
            <div className={`form-message ${message.type === 'error' ? 'is-error' : 'is-success'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ⭐ 별점 */}
            <div className="rating" aria-label="별점 선택">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`star ${(hover || rating) >= n ? 'on' : ''}`}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(n)}
                  aria-label={`${n}점`}
                >
                  <Star filled={(hover || rating) >= n} />
                </button>
              ))}
              <span className="rating-label">
                {rating > 0 ? `${rating}/5` : '\u2190 별점을 선택해 주세요'}
              </span>
            </div>

            {/* 리뷰 내용 */}
            <textarea
              className="review-textarea"
              placeholder="여기에 리뷰를 작성하세요. (최소 1자)"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              rows={5}
            />

            {/* 이미지 미리보기 */}
            <div className="preview-row">
              {imgUrls.map((url, idx) => (
                <div key={`${url}-${idx}`} className="preview-box">
                  <img src={url} alt={`리뷰 이미지 ${idx + 1}`} className="preview-img" />
                </div>
              ))}
            </div>

            {/* 파일 업로드 */}
            <label className="upload-btn">
              사진 등록
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 32 32" aria-hidden="true">
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
            <button type="submit" className="submit-btn" disabled={submitting}onClick={() => console.log('✅ submit button clicked')}  >
              {submitting ? (isEdit ? '수정 중...' : '등록 중...') : isEdit ? '수정하기' : '등록하기'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
