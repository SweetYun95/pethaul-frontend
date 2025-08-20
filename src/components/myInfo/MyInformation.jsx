import { useDispatch } from 'react-redux'
import { formatPhoneNumber } from '../../utils/phoneFormat'
import { useState } from 'react'
import { updateMyInfoThunk } from '../../features/authSlice'
import { useNavigate } from 'react-router-dom'
import { checkEmail } from '../../api/authApi'

function MyInformation({ user }) {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const [inputName, setInputName] = useState(user?.name)
   const [inputEmail, setInputEmail] = useState(user?.email)
   const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber)
   const [newPassword, setNewPassword] = useState('')
   const [checkNewPassword, setCheckNewPassword] = useState('')
   const [inputAddress, setInputAddress] = useState(user?.address || '')
   const [isChangedEmail, setIsChangedEmail] = useState(false)
   const [checkedEmail, setCheckedEmail] = useState(false)
   const [nullEmail, setNullEmail] = useState(false)

   console.log('🎈확인1:', isChangedEmail)
   console.log('🎈확인2:', checkedEmail)

   const handleChangeEmail = (e) => {
      setInputEmail(e.target.value)
      setIsChangedEmail(true)
      setCheckedEmail(false)
   }
   const handleDeleteEmail = () => {
      setInputEmail('')
      setIsChangedEmail(false)
      setCheckedEmail(true)
      setNullEmail(true)
   }

   const handleCheckEmail = () => {
      checkEmail(inputEmail)
         .then(() => {
            alert('사용 가능한 이메일입니다.')
            setCheckedEmail(true)
            setIsChangedEmail(false)
         })
         .catch((error) => {
            if (error.status === 409) {
               alert('이미 사용 중인 이메일입니다.')
            } else {
               alert('이메일 중복 확인 중 오류가 발생했습니다.:' + error)
            }

            setCheckedEmail(false)
            setIsChangedEmail(true)
         })
   }

   const handleSubmit = (e) => {
      e.preventDefault()

      if (isChangedEmail && !checkedEmail) {
         alert('이메일 중복 확인이 필요합니다.')
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
         name: inputName,
         email: inputEmail,
         ...(cleanedPhone ? { phoneNumber: cleanedPhone } : {}),
         address: inputAddress,
         ...(newPassword ? { newPassword } : {}),
      }

      dispatch(updateMyInfoThunk(data))
         .unwrap()
         .then(() => {
            alert('회원 정보를 성공적으로 수정했습니다.')
            navigate('/mypage')
         })
         .catch((error) => alert('회원 정보 수정 중 오류가 발생했습니다.: ' + error))
   }

   return (
      <>
         {user && (
            <div
               style={{
                  marginTop: '200px',
               }}
            >
               <p>* ID</p>
               <input label="ID" name="id" value={user?.userId} readOnly />
               <form onSubmit={handleSubmit}>
                  <p>* 이름</p>
                  <input label="name" name="name" value={inputName} onChange={(e) => setInputName(e.target.value)} required />

                  <p> E-mail</p>
                  <input label="email" name="email" value={inputEmail} onChange={handleChangeEmail} disabled={nullEmail} />
                  <button type="button" disabled={!isChangedEmail} onClick={handleCheckEmail}>
                     중복 확인
                  </button>
                  <button type="button" onClick={handleDeleteEmail}>
                     이메일 삭제
                  </button>

                  <p>전화번호</p>
                  <input label="phone" name="phone" value={formatPhoneNumber(phoneNumber)} onChange={(e) => setPhoneNumber(e.target.value)} />

                  <p>주소</p>
                  <input label="address" name="address" value={inputAddress} onChange={(e) => setInputAddress(e.target.value)} />

                  <p>비밀번호 변경하기 (선택)</p>
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
