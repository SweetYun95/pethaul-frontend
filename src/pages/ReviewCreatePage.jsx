import CreateReviewForm from '../components/review/CreateReviewForm'

import { useLocation } from 'react-router-dom'

function ReviewCreatePage() {
   const location = useLocation()
   const { item } = location.state || {}
   return (
      <div style={{ backgroundColor: '#F2FAFF', paddingTop: '74px' }}>
         <CreateReviewForm item={item} />
      </div>
   )
}

export default ReviewCreatePage
