import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteReviewThunk, getUserReviewThunk } from '../features/reviewSlice'
import { Container, Button } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'

function MyReviewList() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { reviews, loading, error } = useSelector((state) => state.review)
   useEffect(() => {
      dispatch(getUserReviewThunk())
   }, [dispatch])
   console.log('🎈reviews:', reviews)

   const handleReviewDelete = (id) => {
      dispatch(deleteReviewThunk(id))
         .unwrap()
         .then(() => {
            const res = confirm('정말 삭제하시겠습니까?')
            if (res) {
               alert('후기를 삭제했습니다!')
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
         <table width="100%" style={{ textAlign: 'center' }}>
            <thead>
               <tr>
                  <th>No.</th>
                  <th>작성일</th>
                  <th>후기 내용</th>
                  <th>별점</th>
                  <th></th>
                  <th></th>
               </tr>
            </thead>
            <tbody>
               {reviews.map((r) => (
                  <tr key={r.id}>
                     <td>{r.id}</td>
                     <td>{r.reviewDate.slice(0, 10)}</td>
                     <td>
                        {r.ReviewImages.length > 0 ? <img src={`${import.meta.env.VITE_APP_API_URL}${r.ReviewImages[0].imgUrl}`} width="80px" /> : ''}
                        {/* 이미지 없는 경우 어떻게 처리할지 결정 후 수정 */}
                     </td>
                     <td>{r.reviewContent}</td>
                     <td>{r.rating}</td>
                     <td>
                        <Button component={Link} to={`/review/edit/${r.id}`} state={{ review: r }}>
                           수정
                        </Button>
                     </td>
                     <td>
                        <Button onClick={() => handleReviewDelete(r.id)}>삭제</Button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </Container>
   )
}

export default MyReviewList
