// src/components/slider/PetProfileSlider.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PetProfile from '../myInfo/PetProfile'
import '../css/slider/PetProfileSlider.css'

function PetProfileSlider({ pets }) {
  const navigate = useNavigate()
  const [idx, setIdx] = useState(0)
  const total = pets?.length ?? 0
  const displayTotal = total + 1 // 마지막 장(추가 안내)

  useEffect(() => {
    if (displayTotal === 0) return
    if (idx > displayTotal - 1) setIdx(0)
  }, [displayTotal, idx])

  const prev = () => setIdx((i) => (i === 0 ? displayTotal - 1 : i - 1))
  const next = () => setIdx((i) => (i === displayTotal - 1 ? 0 : i + 1))

  const goEdit = () => {
    const current = pets[idx]
    if (!current) return
    navigate('/peteditpage', { state: { petId: current.id, pet: current } })
  }

  const goCreate = () => navigate('/pets')

  if (!total) {
    return (
      <section id="petprofile-list" className="petprofile-empty">
        <button className="add-btn" onClick={goCreate} aria-label="add">
          + 추가
        </button>
        <p>등록된 반려동물이 없습니다.</p>
        <a className="btn" href="/pets">반려동물 등록하기</a>
      </section>
    )
  }

  const currentPet = pets[idx]

  return (
    <section id="petprofile-list" className="petprofile-slider">


      <button className="pet-arrow left" onClick={prev} aria-label="prev" disabled={displayTotal <= 1} />

      {idx === total ? (
        <div className="add-card">
          <p>새 반려동물을 등록해보세요!</p>
          <button className="add-btn-lg" onClick={goCreate}>
            + 추가하기
          </button>
        </div>
      ) : (
        <>
          <div className="petprofile-wrapper">
            <PetProfile pet={currentPet} />
          </div>

         {/* 버튼 */}
         <div>
        <button className="add-btn" onClick={goCreate} aria-label="add">
          + 추가
         </button>

          <button className="edit-btn" onClick={goEdit} aria-label="edit">
            편집하기
          </button>
          </div>
        </>
      )}

      <button className="pet-arrow right" onClick={next} aria-label="next" disabled={displayTotal <= 1} />
    </section>
  )
}

export default PetProfileSlider
