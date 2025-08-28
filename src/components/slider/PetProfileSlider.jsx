import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PetProfile from '../myInfo/PetProfile'
import '../css/slider/PetProfileSlider.css'

/**
 * props:
 *  - pets: Pet[]
 *  - onDelete?: (petId: number) => Promise<void> | void   // 삭제 콜백(선택)
 */
function PetProfileSlider({ pets, onDelete }) {
  const navigate = useNavigate()
  const list = Array.isArray(pets) ? pets : []
  const total = list.length
  const displayTotal = total + 1 
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (displayTotal <= 0) return
    if (idx > displayTotal - 1) setIdx(0)
  }, [displayTotal, idx])

  const prev = useCallback(
    () => setIdx(i => (i === 0 ? displayTotal - 1 : i - 1)),
    [displayTotal]
  )
  const next = useCallback(
    () => setIdx(i => (i === displayTotal - 1 ? 0 : i + 1)),
    [displayTotal]
  )

  const goEdit = useCallback(() => {
    const current = list[idx]
    if (!current) return
    navigate('/peteditpage', { state: { petId: current.id, pet: current } })
  }, [list, idx, navigate])

  const goCreate = useCallback(() => navigate('/pets'), [navigate])

  const handleDelete = useCallback(async () => {
    const current = list[idx]
    if (!current) return
    const ok = confirm(`정말 "${current.name ?? '이 반려동물'}" 정보를 삭제하시겠어요?`)
    if (!ok) return
    try {
      if (onDelete) {
        await onDelete(current.id)
      } else {
        console.warn('onDelete 콜백이 없습니다. 부모에서 삭제 로직을 전달하세요.')
      }
      setIdx(i => (i > 0 ? i - 1 : 0))
    } catch (e) {
      alert('삭제 중 오류가 발생했어요.')
      console.error(e)
    }
  }, [list, idx, onDelete])

  if (!total) {
    return (
      <section id="petprofile-list" className="petprofile-empty">
        <button className="add-btn" onClick={goCreate} aria-label="add">+ 추가</button>
        <p>등록된 반려동물이 없습니다.</p>
        <a className="btn" href="/pets">반려동물 등록하기</a>
      </section>
    )
  }

  const isAddSlide = idx === total
  const currentPet = !isAddSlide ? list[idx] : null
  const dots = Array.from({ length: displayTotal }, (_, i) => i)

  return (
    <section id="petprofile-list" className="petprofile-slider">
      {/* 좌측 화살표 (SVG) */}
      <button className="pet-arrow left" onClick={prev} aria-label="prev" disabled={displayTotal <= 1}>
        <span aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24">
            <path fill="currentColor" d="M11 13h1v1h1v1h1v1h1v1h1v1h1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1H9v-1H8v-2h1v-1h1V9h1V8h1V7h1V6h1V5h1V4h1v1h1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1z"/>
          </svg>
        </span>
      </button>

      {/* 본문 */}
      <div className="petprofile-wrapper">
        {isAddSlide ? (
          <div className="add-card">
            <p>새 반려동물을 등록해보세요!</p>
            <button className="add-btn-lg" onClick={goCreate}>+ 추가하기</button>
          </div>
        ) : (
          <PetProfile pet={currentPet} />
        )}
      </div>

      {/* 우측 화살표 (SVG) */}
      <button className="pet-arrow right" onClick={next} aria-label="next" disabled={displayTotal <= 1}>
        <span aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24">
            <path fill="currentColor" d="M16 11v2h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1H9v1H8v-1H7v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-2h-1v-1h-1V9h-1V8H9V7H8V6H7V5h1V4h1v1h1v1h1v1h1v1h1v1h1v1h1v1z"/>
          </svg>
        </span>
      </button>

      {/* 페이지네이션 도트 */}
      <div className="pet-dots" role="tablist" aria-label="슬라이드 인디케이터">
        {dots.map((i) => (
          <button
            key={i}
            className={`dot ${i === idx ? 'active' : ''} ${i === total ? 'is-add' : ''}`}
            onClick={() => setIdx(i)}
            role="tab"
            aria-selected={i === idx}
            aria-label={i === total ? '추가 카드' : `${i + 1}번째 반려동물`}
          />
        ))}
      </div>

      {/* 하단 액션 */}
      <div className="pet-actions">
        <button className="add-btn" onClick={goCreate} aria-label="add">+ 추가</button>
        {!isAddSlide && (
          <>
            <button className="edit-btn" onClick={goEdit} aria-label="edit">편집하기</button>
            <button className="delete-btn" onClick={handleDelete} aria-label="delete">삭제</button>
          </>
        )}
      </div>
    </section>
  )
}

export default PetProfileSlider
