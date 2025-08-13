// src/components/slider/PetProfileSlider.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserPetsThunk } from '../../features/petSlice'
import PetProfile from '../myInfo/PetProfile'
import '../css/myInfo/PetProfileSlider.css'

function PetProfileSlider({ pets }) {
   const dispatch = useDispatch()
   // const { user } = useSelector((s) => s.auth)
   // console.log('user', user)

   const [idx, setIdx] = useState(0)
   const total = pets?.length ?? 0

   // const authLoading = useSelector((s) => s.auth.loading)
   // useEffect(() => {
   //    // 새로고침 시 user가 준비된 뒤 호출되도록 가드
   //    if (!authLoading && user?.id) dispatch(getUserPetsThunk())
   // }, [dispatch, authLoading, user?.id])
   //로그인 에러 해결되면 수정

   console.log('🐶 현재 pets 데이터:', pets)

   const prev = () => setIdx((i) => (i === 0 ? total - 1 : i - 1))
   const next = () => setIdx((i) => (i === total - 1 ? 0 : i + 1))

   // if (loading) return <p>반려동물 불러오는 중…</p>
   // if (error) return <p style={{ color: 'red' }}>에러: {String(error)}</p>

   if (!total) {
      return (
         <section id="petprofile-list" style={{ padding: 16 }}>
            <p>등록된 반려동물이 없습니다.</p>
            <a className="btn" href="/pets">
               반려동물 등록하기
            </a>
         </section>
      )
   }

   return (
      <section id="petprofile-list">
         <button className="pet-arrow left" onClick={prev} aria-label="prev">
            {/* ...아이콘 그대로... */}
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
               <path fill="#000" d="M11 13h1v1h1v1h1v1h1v1h1v1h1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1H9v-1H8v-2h1v-1h1V9h1V8h1V7h1V6h1V5h1V4h1v1h1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1z" strokeWidth={0.5} stroke="#000"></path>
            </svg>
         </button>

         <div className="pet-viewport">
            <div className="pet-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
               {pets.map((pet) => (
                  <div className="pet-slide" key={pet.id}>
                     <PetProfile pet={pet} />
                  </div>
               ))}
            </div>
         </div>

         <button className="pet-arrow right" onClick={next} aria-label="next">
            {/* ...아이콘 그대로... */}
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
               <path fill="#000" d="M16 11v2h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1H9v1H8v-1H7v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-2h-1v-1h-1V9h-1V8H9V7H8V6H7V5h1V4h1v1h1v1h1v1h1v1h1v1h1v1h1v1z" strokeWidth={0.5} stroke="#000"></path>
            </svg>
         </button>
      </section>
   )
}

export default PetProfileSlider
