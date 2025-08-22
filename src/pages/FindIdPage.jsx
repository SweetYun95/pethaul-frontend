import { Container } from '@mui/material'
import FindFormBase from '../components/auth/FindFormBase'

function FindIdPage() {
   const mode = 'id'
   return (
      <>
         <div className='blue-background'>
            <FindFormBase mode={mode} />
         </div>
      </>
   )
}

export default FindIdPage
