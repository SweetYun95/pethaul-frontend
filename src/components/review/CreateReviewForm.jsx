import { Container, TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createReviewThunk } from '../../features/reviewSlice'
import { useNavigate } from 'react-router-dom'

function CreateReviewForm() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [reviewImages, setReviewImages] = useState([])
   const [imgUrls, setImgUrls] = useState([])
   const [reviewContent, setReviewContent] = useState('')
   const [rating, setRating] = useState(0)
   //테스트용 임시 코드
   const itemId = 1

   // 등록한 이미지 미리보기
   const handleImageChange = (e) => {
      const files = e.target.files
      console.log('💻[handleImageChange] files:', files)
      if (!files || files.length === 0) return

      const newFiles = Array.from(files).slice(0, 4)
      setReviewImages(newFiles)

      const newImgUrl = newFiles.map((file) => {
         const reader = new FileReader()
         reader.readAsDataURL(file)
         return new Promise((resolve) => {
            reader.onload = (data) => {
               resolve(data.target.result)
            }
         })
      })
      Promise.all(newImgUrl).then((url) => {
         setImgUrls(url)
      })
   }

   const onReviewSubmit = (formData) => {
      dispatch(createReviewThunk(formData))
         .unwrap()
         .then(() => {
            alert('후기를 작성했습니다!')
            navigate('/')
         })
         .catch((error) => {
            console.error('상품 등록 에러:', error)
            alert('상품 등록에 실패했습니다. ' + error)
         })
   }
   const handleSubmit = (e) => {
      e.preventDefault()
      if (!reviewContent.trim()) {
         alert('후기 입력란에 내용을 작성해 주세요.')
         return
      }
      // if (!rating) {
      //    alert('별점을 선택해 주세요.')
      //    return
      // }
      // 별점 어떻게 구현할지 상의 후 주석 해제, 화면에 별점 출력 코드 추가 필요

      const formData = new FormData()
      formData.append('reviewContent', reviewContent)
      formData.append('rating', rating)
      formData.append('itemId', itemId)
      formData.append('reviewDate', new Date().toISOString())

      reviewImages.forEach((file) => {
         const encodedFile = new File([file], encodeURIComponent(file.name), { type: file.type })
         formData.append('img', encodedFile)
      })
      onReviewSubmit(formData)
   }
   return (
      <>
         <Typography>productname에 대해 얼마나 만족하시나요?</Typography>
         <Box component="form" onSubmit={handleSubmit}>
            <TextField multiline minRows={5} fullWidth placeholder="여기에 리뷰를 작성하세요" onChange={(e) => setReviewContent(e.target.value)} />
            <Box display="flex" gap={2} mt={2}>
               {imgUrls.map((url, index) => (
                  <Box
                     key={index}
                     sx={{
                        width: '120px',
                        height: '120px',
                     }}
                  >
                     <img src={url} alt={`리뷰 이미지 ${index + 1}`} style={{ width: '100%' }} />
                  </Box>
               ))}
            </Box>
            <Button variant="outlined" component="label">
               사진 등록
               <input type="file" name="img" accept="image/*" hidden multiple onChange={handleImageChange} />
            </Button>
            <Button type="submit" variant="outlined">
               등록하기
            </Button>
         </Box>
      </>
   )
}

export default CreateReviewForm
