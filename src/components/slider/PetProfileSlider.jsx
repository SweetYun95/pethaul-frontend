// src/components/slider/PetProfileSlider.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PetProfile from '../myInfo/PetProfile'
import '../css/myInfo/PetProfileSlider.css'
import { Box } from '@mui/material'

function PetProfileSlider({ pets }) {
   const navigate = useNavigate()
   const [idx, setIdx] = useState(0)
   const total = pets?.length ?? 0
   console.log('total', total)
   const displayTotal = total + 1 // 마지막 장
   console.log('displayTotal', displayTotal)

   // total이 바뀌면 idx를 안전하게 보정
   useEffect(() => {
      if (displayTotal === 0) return
      if (idx > displayTotal - 1) setIdx(0)
   }, [displayTotal])

   const prev = () => setIdx((i) => (i === 0 ? displayTotal - 1 : i - 1))
   const next = () => setIdx((i) => (i === displayTotal - 1 ? 0 : i + 1))

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
   console.log('currentPet', currentPet)

   return (
      <section id="petprofile-list">
         <button className="pet-arrow left" onClick={prev} aria-label="prev" disabled={displayTotal <= 1} />

         {idx === total ? (
            // ✅ 마지막 페이지: 추가하기 버튼
            <Box
               sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
               }}
            >
               <p>새 반려동물을 등록해보세요!</p>
               <button
                  onClick={() => navigate('/pets')}
                  style={{
                     padding: '8px 16px',
                     borderRadius: 8,
                     border: '1px solid #ddd',
                     background: '#fff',
                     cursor: 'pointer',
                     boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
               >
                  + 추가하기
               </button>
            </Box>
         ) : (
            <>
               <Box
                  sx={{
                     width: '100%',
                     display: 'flex',
                     justifyContent: 'center',
                  }}
               >
                  <PetProfile pet={currentPet} />
               </Box>

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
            </>
         )}

         <button className="pet-arrow right" onClick={next} aria-label="next" disabled={displayTotal <= 1} />
      </section>
   )
}

export default PetProfileSlider
