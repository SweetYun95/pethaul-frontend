import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteReviewThunk, getUserReviewThunk } from '../features/reviewSlice'
import { Container, Button, Box, Typography } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'

function MyReviewList() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { reviews, loading, error } = useSelector((state) => state.review)
   useEffect(() => {
      dispatch(getUserReviewThunk())
   }, [dispatch])
   // console.log('🎈reviews:', reviews)

   const handleReviewDelete = (id) => {
      dispatch(deleteReviewThunk(id))
         .unwrap()
         .then(() => {
            const res = confirm('정말 삭제하시겠습니까?')
            if (res) {
               alert('후기를 삭제했습니다!')
               dispatch(getUserReviewThunk())
               navigate('/myreviewlist')
            }
         })
         .catch((error) => {
            alert('후기 삭제에 실패했습니다.:', error)
            console.log('후기 삭제 중 에러 발생: ' + error)
         })
   }

   if (loading) return <p>로딩 중...</p>
   if (error) return <p>에러 발생: {error}</p>
   return (
      <Container>
         <Box>
            <Typography variant="h6">리뷰 목록</Typography>
         </Box>
         {/* 리뷰 내역 출력 박스 */}
         <Box sx={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {reviews.map((r) => (
               <Box key={r.id} sx={{ display: 'flex', justifyContent: 'space-around' }}>
                  <Box>
                     <Typography>{r.reviewDate.slice(0, 10)}</Typography>
                     {r.ReviewImages.length > 0 ? <img src={`${import.meta.env.VITE_APP_API_URL}${r.ReviewImages[0].imgUrl}`} width="100px" /> : ''}
                     {/* 이미지 없는 리뷰 어떻게 할지 결정 필요 */}
                  </Box>
                  <Box>
                     <Typography>{r.Item.itemNm}</Typography>
                     <Typography>{r.rating}</Typography>
                     <Typography>{r.Item.price}원</Typography>
                     <Typography>{r.reviewContent}</Typography>
                     <Button component={Link} to={`/review/edit/${r.id}`} state={{ review: r }}>
                        수정
                     </Button>
                     <Button onClick={() => handleReviewDelete(r.id)}>삭제</Button>
                  </Box>
               </Box>
            ))}
         </Box>
      </Container>
   )
}

export default MyReviewList
