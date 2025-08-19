import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { formatPhoneNumber } from '../../utils/phoneFormat'
import { useState } from 'react'

import { updateMyInfoThunk } from '../../features/authSlice'
import { checkUsername } from '../../api/authApi'

function MyInformation({ user }) {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const [inputName, setInputName] = useState(user?.name)
   const [inputId, setInputId] = useState(user?.userId)
   const [inputEmail, setInputEmail] = useState(user?.email)
   const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber)
   const [inputPassword, setInputPassword] = useState('')
   const [newPassword, setNewPassword] = useState('')
   const [checkNewPassword, setCheckNewPassword] = useState('')
   const [inputAddress, setInputAddress] = useState(user?.address || '')
   const [idChecking, setIdChecking] = useState(false)
   const [isIdAvailable, setIsIdAvailable] = useState(null)

   const handleIdCheck = async () => {
      const userId = inputId
      if (!userId) {
         alert('아이디를 입력하세요')
         return
      }

      setIdChecking(true)
      try {
         const res = await checkUsername(userId)
         if (res.status === 200) {
            alert('사용 가능한 아이디입니다')
            setIsIdAvailable(true)
         } else {
            alert('이미 사용 중인 아이디입니다')
            setIsIdAvailable(false)
         }
      } catch (error) {
         if (error.status === 409) {
            alert('이미 사용 중인 아이디입니다.')
         } else {
            alert('중복 확인 중 오류가 발생했습니다.:' + error)
         }

         setIsIdAvailable(false)
      } finally {
         setIdChecking(false)
      }
   }

   const handleSubmit = (e) => {
      e.preventDefault()

      if (!idChecking) {
         alert('아이디 중복 확인이 필요합니다.')
         return
      }
      if (newPassword) {
         if (!checkNewPassword) {
            alert('비밀번호 확인이 필요합니다.')
            return
         }
         if (newPassword != checkNewPassword) {
            alert('새 비밀번호와 비밀번호 확인 값이 일치하지 않습니다.')
            return
         }
      }

      const cleanedPhone = phoneNumber ? phoneNumber.replace(/-/g, '') : null

      const data = {
         userId: inputId,
         password: inputPassword,
         name: inputName,
         email: inputEmail,
         ...(cleanedPhone ? { phoneNumber: cleanedPhone } : {}),
         address: inputAddress,
         ...(newPassword ? { newPassword } : {}),
      }

      dispatch(updateMyInfoThunk(data))
   }

   return (
      <>
         {user && (
            <div
               style={{
                  marginTop: '200px',
               }}
            >
               <form onSubmit={handleSubmit}>
                  <p>* 이름</p>
                  <input label="name" name="name" value={inputName} onChange={(e) => setInputName(e.target.value)} required />

                  <p>* ID</p>
                  <input
                     label="ID"
                     name="id"
                     value={inputId}
                     onChange={(e) => {
                        setInputId(e.target.value)
                        setIsIdAvailable(false)
                        setIdChecking(false)
                     }}
                     required
                  />
                  <button onClick={handleIdCheck} disabled={isIdAvailable}>
                     중복 확인
                  </button>

                  <p>* E-mail</p>
                  <input label="email" name="email" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} required />

                  <p>전화번호</p>
                  <input label="phone" name="phone" value={formatPhoneNumber(phoneNumber)} onChange={(e) => setPhoneNumber(e.target.value)} />

                  <p>* 비밀번호</p>
                  <input label="현재 비밀번호" name="password" placeholder="현재 비밀번호를 입력하세요." value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} required />

                  <p>주소</p>
                  <input label="address" name="address" value={inputAddress} onChange={(e) => setInputAddress(e.target.value)} />

                  <p>비밀번호 변경하기</p>
                  <input label="새 비밀번호" name="new-password" placeholder="변경할 비밀번호를 입력하세요" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <input label="새 비밀번호 확인" name="check-new-password" placeholder="변경할 비밀번호를 한 번 더 입력하세요" value={checkNewPassword} onChange={(e) => setCheckNewPassword(e.target.value)} />
                  {newPassword != checkNewPassword && <p style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</p>}
                  <br />
                  <button type="submit">수정하기</button>
               </form>
            </div>
         )}
      </>
   )
}

export default MyInformation
