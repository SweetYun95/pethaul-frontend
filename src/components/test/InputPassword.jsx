import { useState } from 'react'

function InputPassWord() {
   const [password, setPassword] = useState('')
   return (
      <>
         <input value={password} onChange={(e) => setPassword(e.target.value)} />
      </>
   )
}

export default InputPassWord
