import { useLocation, useParams } from 'react-router-dom'

import EditReviewForm from '../components/review/EditReviewForm'

function ReviewEditPage() {
   const { id } = useParams()
   const location = useLocation()
   const review = location.state?.review

   return (
      <div className='blue-background'>
         <EditReviewForm id={id} review={review} />
      </div>
   )
}

export default ReviewEditPage
