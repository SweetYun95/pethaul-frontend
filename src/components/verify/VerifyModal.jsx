import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { verifyPasswordThunk } from '../../features/authSlice'
import '../css/verify/VerifyModal.css'

export default function VerifyModal() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState({ type: null, text: '' }) // ✅ 인라인 메시지
  const inputRef = useRef(null)
  const bg = location.state?.backgroundLocation || { pathname: '/mypage/edit' }

  // body 스크롤 잠금
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // 입력만 초기화하고 메시지는 유지
  const clearInputKeepMsg = () => {
    setPassword('')
    setSubmitting(false)
    setTimeout(() => inputRef.current?.focus(), 0)
  }
  // 전체 리셋이 필요할 때 사용
  const resetAll = () => {
    setMsg({ type: null, text: '' })
    clearInputKeepMsg()
  }

  // ESC → 입력만 초기화
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        clearInputKeepMsg()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onBackdrop = (e) => {
    e.stopPropagation()
    clearInputKeepMsg()
  }

  // ❌ X 버튼: 알림 후 마이페이지로
  const onCloseIcon = (e) => {
    e.preventDefault()
    alert('마이페이지로 돌아갑니다.')
    navigate('/mypage', { replace: true })
  }

  const onCancel = (e) => {
    e.preventDefault()
    clearInputKeepMsg() // 닫지 않고 다시 입력
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setMsg({ type: null, text: '' })

    dispatch(verifyPasswordThunk(password))
      .unwrap()
      .then(() => {
        setMsg({ type: 'success', text: '비밀번호가 확인되었습니다.' })
        setTimeout(() => {
          navigate(bg, { replace: true, state: { verified: true } })
        }, 600) // 성공 문구 잠깐 보여주고 이동
      })
      .catch((err) => {
        const text = typeof err === 'string'
          ? err
          : (err?.code === 'INVALID_PASSWORD'
              ? '비밀번호가 올바르지 않습니다.'
              : '비밀번호 확인 중 오류가 발생했습니다. 다시 시도해 주세요.')
        setMsg({ type: 'error', text })
        clearInputKeepMsg() // 메시지는 유지, 입력만 초기화
      })
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="modal-backdrop" onClick={onBackdrop}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h2>본인 확인</h2>
          <button type="button" className="icon-close" aria-label="닫기" onClick={onCloseIcon}>×</button>
        </header>

        <form className="modal__body" onSubmit={handleSubmit} autoComplete="off">
          {msg.text && (
            <p className={`msg ${msg.type === 'error' ? 'msg--error' : 'msg--success'}`}>
              {msg.text}
            </p>
          )}

          <label htmlFor="password">비밀번호</label>
          <input
            ref={inputRef}
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onCancel}>다시 입력</button>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? '확인 중...' : '확인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
