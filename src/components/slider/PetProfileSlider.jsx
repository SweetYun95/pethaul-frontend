// src/components/slider/PetProfileSlider.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PetProfile from '../myInfo/PetProfile'
import '../css/myInfo/PetProfileSlider.css'

function PetProfileSlider({ pets }) {
   const navigate = useNavigate()
   const [idx, setIdx] = useState(0)
   const total = pets?.length ?? 0

   // total이 바뀌면 idx를 안전하게 보정
   useEffect(() => {
      if (total === 0) return
      if (idx > total - 1) setIdx(0)
   }, [total])

   const prev = () => setIdx((i) => (i === 0 ? total - 1 : i - 1))
   const next = () => setIdx((i) => (i === total - 1 ? 0 : i + 1))

   const goEdit = () => {
      const current = pets[idx]
      if (!current) return
      // ✅ 키 이름 petId로 통일
      navigate('/peteditpage', { state: { petId: current.id, pet: current } })
   }

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

   const currentPet = pets[idx]

   return (
      <section id="petprofile-list">
         <button className="pet-arrow left" onClick={prev} aria-label="prev" disabled={total <= 1}>
            {/* 아이콘 생략 */}
         </button>

         {/* ✅ 현재 보이는 펫만 렌더링 */}
         <div className="pet-viewport">
            <div className="pet-slide" style={{ position: 'relative' }}>
               <PetProfile pet={currentPet} />
               <button
                  className="edit-btn"
                  onClick={goEdit}
                  aria-label="edit"
                  style={{
                     position: 'absolute',
                     right: 12,
                     bottom: 12,
                     padding: '8px 12px',
                     borderRadius: 8,
                     border: '1px solid #ddd',
                     background: '#fff',
                     cursor: 'pointer',
                     boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
               >
                  편집하기
               </button>
            </div>
         </div>

         <button className="pet-arrow right" onClick={next} aria-label="next" disabled={total <= 1}>
            {/* 아이콘 생략 */}
         </button>
      </section>
   )
}

export default PetProfileSlider
