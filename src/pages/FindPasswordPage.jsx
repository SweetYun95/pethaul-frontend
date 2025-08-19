import { Container } from '@mui/material'
import FindFormBase from '../components/auth/FindFormBase'

function FindPasswordPage() {
   const mode = 'pw'
   return (
      <>
         <Container>
            <FindFormBase mode={mode} />
         </Container>
      </>
   )
}

export default FindPasswordPage
