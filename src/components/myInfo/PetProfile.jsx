import '../css/myInfo/PetProfile.css'

function PetProfile({ pet }) {
   return (
    <div className='my-pet-card'>
     <div className='petprofile-change'>
      <img src="/images/petprofile.jpeg" alt="profile" />
      <a>프로필편집</a>
      {/* 펫정보수정링크 */}
     </div>
     <div className='petprofile-info'>
      <h1>{pet?.name}</h1>
      <div>
        <p>동물종류/품종</p>
        <p>{pet?.type}</p>
      </div>
      <div>
        <p>나이</p>
        <p>{pet?.age}</p>
      </div>
      <div>
         <p>성별</p>
         <p>{pet?.gender}</p>
      </div>
     </div>
   </div>
   )
}

export default PetProfile
