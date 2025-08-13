// =============================
// File: src/components/myInfo/Profile.jsx
// =============================
import { Link } from 'react-router-dom'
import '../css/myInfo/Profile.css'

/**
 * 안전가드 + 가독개선 버전
 * - user가 null인 초기 구간에서도 스켈레톤 출력
 * - provider/role 뱃지 노출
 * - 전화번호 미등록 시 안내 텍스트
 * - 아바타 우선순위: user.avatar || 구글사진(user.picture) || 기본이미지
 */
function Profile({ user, loading = false }) {
   // 스켈레톤/로딩 가드
   if (loading || !user) {
      return (
         <section id="profile-section">
            <div className="contents-card top">
               <div className="card-header">
                  <div className="window-btn">
                     <span className="red"></span>
                     <span className="green"></span>
                     <span className="blue"></span>
                  </div>
                  <span className="card-title">PROFILE</span>
               </div>
               <div className="profile-info">
                  <div className="avatar-skeleton" aria-hidden />
                  <div>
                     <p className="name skeleton">이름: 로딩중...</p>
                     <p className="email skeleton">이메일: 로딩중...</p>
                     <p className="phone skeleton">전화번호: 로딩중...</p>
                     <p className="role skeleton">권한: 로딩중...</p>
                  </div>
                  <span className="btn disabled" aria-disabled>
                     회원정보수정
                  </span>
               </div>
            </div>
         </section>
      )
   }

   const displayName = user.name || '이름 미등록'
   const displayEmail = user.email || '이메일 미등록'
   const displayPhone = user.phoneNumber ?? user.phone ?? (user.provider === 'google' ? '구글 계정 연동 (전화번호 미등록)' : '미등록')
   const displayRole = user.role || 'USER'
   const provider = user.provider || 'local'

   const avatar = user.avatar || user.picture || '/images/profile.jpeg'

   return (
      <section id="profile-section">
         <div className="contents-card top">
            <div className="card-header">
               <div className="window-btn">
                  <span className="red"></span>
                  <span className="green"></span>
                  <span className="blue"></span>
               </div>
               <span className="card-title">PROFILE</span>
            </div>

            <div className="profile-info">
               <img
                  src={avatar}
                  alt={`${displayName}의 프로필 사진`}
                  onError={(e) => {
                     e.currentTarget.src = '/images/profile.jpeg'
                  }}
               />

               <div>
                  <p className="name">이름: {displayName}</p>
                  <p className="email">이메일: {displayEmail}</p>
                  <p className="phone">전화번호: {displayPhone}</p>
                  <p className="role">
                     권한: <span className={`role-badge role-${displayRole}`}>{displayRole}</span>
                     {provider && (
                        <span className={`provider-badge provider-${provider}`} style={{ marginLeft: 8 }}>
                           {provider.toUpperCase()}
                        </span>
                     )}
                  </p>
                  {user.userId && (
                     <p className="userid" title="내부 사용자 식별자">
                        ID: {user.userId}
                     </p>
                  )}
               </div>

               {/* 회원정보수정 페이지 라우트는 프로젝트에 맞게 변경 */}
               <Link to="/mypage/edit" className="btn">
                  회원정보수정
               </Link>
            </div>
         </div>
      </section>
   )
}

export default Profile
