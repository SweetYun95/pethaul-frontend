// src/components/myInfo/Profile.jsx
import { Link } from 'react-router-dom'
import '../css/myInfo/Profile.css'


function Profile({ user, loading = false }) {
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
               <div>
               <img
                  src={avatar}
                  alt={`${displayName}의 프로필 사진`}
                  onError={(e) => {
                     e.currentTarget.src = '/images/profile.jpeg'
                  }}
               />
                   {/* 회원정보수정 페이지 라우트는 프로젝트에 맞게 변경 */}
               <Link to="/mypage/edit" className="btn">
                  회원정보수정
               </Link>
               </div>
               <div>
                  <p className="username">이름: {displayName}</p>
                  <p className="useremail">이메일: {displayEmail}</p>
                  <p className="userphone">전화번호: {displayPhone}</p>
                  <p className="userrole">
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

           
            </div>
         </div>
      </section>
   )
}

export default Profile
