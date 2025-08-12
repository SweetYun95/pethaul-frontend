import '../css/myInfo/Profile.css'

function Profile({ user }) {
   return (
      <>
         <section id='profile-section'>
            <div className='contents-card top'>
               <div className='card-header' >
                  <div className='window-btn'>
                  <span className='red'></span>
                  <span className='green'></span>
                  <span className='blue'></span>
                  </div>
                  <span className='card-title'>PROFILE</span>
               </div>
            <div className='profile-info'>
               <img src="/images/profile.jpeg" alt="profile" />
               {/* 이미지 예시 넣어놈*/}
               <div>
                 <p className='name'>하하{user?.name}</p>
                 <p className='email'>hahah@gmail.com{user?.email}</p>
                 <p className='phone'>010-1234-5678{user?.phone}</p>
                 <p className='role'>ㅎㅎ{user?.role}</p>
               </div>
               <a href="">회원정보수정</a>
               {/* 회원정보수정페이지링크 */}
            </div>
               </div>
         </section>
      </>
   )
}

export default Profile
