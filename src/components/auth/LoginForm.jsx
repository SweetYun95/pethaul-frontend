// src/components/auth/LoginForm.jsx
import { Typography, Alert } from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginUserThunk } from '../../features/authSlice'
import '../css/auth/LoginForm.css'

// API Base (구글 OAuth 리다이렉트용)
const API = (`${import.meta.env.VITE_APP_API_URL}` || '').replace(/\/$/, '')

function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    id: '',
    password: '',
    saveIdToggle: false,
  })

  // 더블클릭 보호
  const submittedRef = useRef(false)

  // 저장된 ID 불러오기
  useEffect(() => {
    const saveId = localStorage.getItem('savedUserId')
    if (saveId?.trim()) {
      setFormData((prev) => ({
        ...prev,
        id: saveId.trim(),
        saveIdToggle: true,
      }))
    }
  }, [])

  // 로그인 성공 시 이동
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (submittedRef.current || loading) return

    // 기본 유효성 검사
    if (!formData.id.trim() || !formData.password.trim()) {
      alert('아이디와 비밀번호를 모두 입력하세요')
      return
    }

    // 아이디 저장
    if (formData.saveIdToggle) {
      localStorage.setItem('savedUserId', formData.id)
    } else {
      localStorage.removeItem('savedUserId')
    }

    submittedRef.current = true
    // 로그인 thunk 호출 (userId + password)
    dispatch(loginUserThunk({ userId: formData.id, password: formData.password }))
      .finally(() => {
        submittedRef.current = false
      })
  }

  return (
    <section id="login-section">
      <div className="login-form">
        <h1 className="section-title">
          로그인
          {/* public 폴더 이미지는 절대 경로로 */}
          <img src="/images/발바닥.png" alt="발바닥" />
        </h1>

        <form style={{ width: '100%' }} onSubmit={handleSubmit} noValidate>
          <div className="login-inside">
            <div className="input-section">
              <div>
                <p>ID</p>
                <input
                  aria-label="아이디"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="아이디를 입력하세요"
                  autoComplete="username"
                />
              </div>

              <div>
                <p>Password</p>
                <input
                  aria-label="비밀번호"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                />
              </div>

              <label className="checkbox">
                <input
                  type="checkbox"
                  name="saveIdToggle"
                  checked={formData.saveIdToggle}
                  onChange={handleChange}
                />
                아이디 저장
              </label>
            </div>

            {error && <Alert severity="error">{String(error)}</Alert>}
            {loading && <Typography>로그인 중...</Typography>}

            <div className="find-section">
              <Link className="find-link" to="/find-id">아이디 찾기</Link>
              <Link className="find-link" to="/find-password">비밀번호 찾기</Link>
              <Link className="find-link" to="/join">회원가입</Link>
            </div>

            <div className="button-section">
              <button
                className="login-btn"
                type="submit"
                disabled={loading || submittedRef.current}
              >
                로그인
              </button>

              <button
                className="google-login-btn"
                type="button"
                onClick={() => { window.location.href = `${API}/auth/google` }}
                disabled={loading}
              >
                <img src="/images/Google.png" alt="google" />
                구글 아이디로 로그인
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

export default LoginForm

