import { Container } from '@mui/material'
import FindFormBase from '../components/auth/FindFormBase'

function FindPasswordPage() {
   const mode = 'pw'
   return (
      <>
         <div className='blue-background'>
            <FindFormBase mode={mode} />
         </div>
      </>
   )
}

export default FindPasswordPage
