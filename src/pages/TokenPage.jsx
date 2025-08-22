import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import {
  checkTokenStatusThunk,
  getTokenThunk,
  readTokenThunk,
  refreshTokenThunk,
} from '../features/tokenSlice'

import './css/TokenPage.css' 

function TokenPage() {
  const dispatch = useDispatch()
  const { token, tokenStatus, loading, error } = useSelector((state) => state.token)

  // 보유한 토큰 조회
  useEffect(() => {
    dispatch(readTokenThunk())
  }, [dispatch])

  // 토큰 유효성 검증
  useEffect(() => {
    if (token) dispatch(checkTokenStatusThunk())
  }, [dispatch, token])

  // 토큰 발급 onClick
  const handleGetToken = () => {
    dispatch(getTokenThunk())
  }

  // 토큰 유효성 검증 실패시 재발급 onClick
  const handleRefreshToken = () => {
    dispatch(refreshTokenThunk())
  }

  if (loading) return <p>로딩 중...</p>

  return (
    <div className="dot-background">
      <section id='token-section'>
      <h2 className="section-title">API Key 발급받기</h2>

      {error && <p className="token-error">에러 발생: {error}</p>}

      <input
        type="text"
        className="token-input"
        value={token || ''}
        readOnly
        placeholder="발급받은 토큰이 표시됩니다."
      />

      {token && <p className="token-info">발급받은 토큰이 존재합니다.</p>}

      {!token && (
        <button className="btn btn-outline" onClick={handleGetToken}>
          발급받기
        </button>
      )}

      {tokenStatus === 'expired' && (
        <>
          <p className="token-expired">토큰이 만료되었습니다.</p>
          <button className="btn btn-outline" onClick={handleRefreshToken}>
            재발급받기
          </button>
        </>
      )}

      {tokenStatus === 'invalid' && (
        <p className="token-error">토큰이 유효하지 않습니다. 관리자에게 문의하세요.</p>
      )}
      </section>
    </div>
  )
}

export default TokenPage
