import { Container } from '@mui/material'
import FindFormBase from '../components/auth/FindFormBase'

function FindIdPage() {
   const mode = 'id'
   return (
      <>
         <Container>
            <FindFormBase mode={mode} />
         </Container>
      </>
   )
}

export default FindIdPage
