// src/pages/EditMyInfoPage.jsx
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import MyInformation from '../components/myInfo/MyInformation'

function EditMyInfoPage() {
  const { user, loading, error } = useSelector((s) => s.auth)
  const location = useLocation()
  const navigate = useNavigate()
  const verified = location.state?.verified === true

  const openedRef = useRef(false)
  useEffect(() => {
    if (!verified && !openedRef.current) {
      openedRef.current = true
      // 현재 위치를 배경으로 넘기면서 모달 오픈
      navigate('/verify', { state: { backgroundLocation: location }, replace: true })
    }
  }, [verified, location, navigate])

  if (loading) return <p>로딩 중...</p>
  if (error) return <p>에러 발생: {String(error)}</p>

  return (
    <div className="blue-background">
      <MyInformation user={user} readOnly={!verified} />
    </div>
  )
}
export default EditMyInfoPage
