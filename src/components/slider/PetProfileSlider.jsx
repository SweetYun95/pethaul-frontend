import { useState } from 'react'
import PetProfile from '../myInfo/PetProfile'
import '../css/myInfo/PetProfileSlider.css'

function PetProfileSlider({ pets = [] }) {
  const [idx, setIdx] = useState(0)
  const total = pets.length

  const prev = () => setIdx((i) => (i === 0 ? total - 1 : i - 1))
  const next = () => setIdx((i) => (i === total - 1 ? 0 : i + 1))

  if (!total) return null

  return (
    <section id='petprofile-list'>
      <button className="pet-arrow left" onClick={prev} aria-label="prev">
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#000" d="M11 13h1v1h1v1h1v1h1v1h1v1h1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1H9v-1H8v-2h1v-1h1V9h1V8h1V7h1V6h1V5h1V4h1v1h1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1z" strokeWidth={0.5} stroke="#000"></path></svg>
      </button>

      <div className="pet-viewport">
        <div
          className="pet-track"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {pets.map((pet, i) => (
            <div className="pet-slide" key={i}>
              {/* 네가 만든 카드 그대로 렌더 */}
              <PetProfile pet={pet} />
            </div>
          ))}
        </div>
      </div>

      <button className="pet-arrow right" onClick={next} aria-label="next">
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#000" d="M16 11v2h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1H9v1H8v-1H7v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-2h-1v-1h-1V9h-1V8H9V7H8V6H7V5h1V4h1v1h1v1h1v1h1v1h1v1h1v1h1v1z" strokeWidth={0.5} stroke="#000"></path></svg>
      </button>
   </section>
  )
}

export default PetProfileSlider
