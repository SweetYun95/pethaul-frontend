// src/components/myInfo/PetProfile.jsx
import { useMemo } from 'react'
import '../css/myInfo/PetProfile.css'
import { Link } from 'react-router-dom'

const PetProfile = ({ pet = {} }) => {
   const base = useMemo(() => import.meta.env.VITE_APP_API_URL || '', [])
   const repImg = (() => {
      const img = pet.images?.find((i) => i.isPrimary)?.imgUrl || pet.images?.[0]?.imgUrl || '/images/no-image.jpg'
      return img?.startsWith('/images/') ? img : `${base}${img || ''}`
   })()

   const genderLabel = (g) => (g === 'M' ? '남' : g === 'F' ? '여' : '-')

   return (
      <article className="my-pet-card">
         {/* 왼쪽: 이미지 + 수정 링크 */}
         <div className="petprofile-change">
            <img src={repImg} alt={pet.petName || '반려동물'} loading="lazy" />

            <Link to="/peteditpage" state={{ pet }}>
               프로필 수정
            </Link>
         </div>

         {/* 오른쪽: 반려동물 정보 */}
         <div className="petprofile-info">
            <h1>{pet.petName || '-'}</h1>
            <div>
               <p>
                  {pet.petType ?? '-'}/{pet.breed ?? '-'}
               </p>
               <p>나이 {pet.age ?? '-'}</p>
               <p>성별 {genderLabel(pet.gender)}</p>
            </div>
         </div>
      </article>
   )
}

export default PetProfile
