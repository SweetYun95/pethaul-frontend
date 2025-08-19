// src/components/item/ItemSearchTap.jsx
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchItemsThunk } from '../../features/itemSlice'

function ItemSearchTap({ items }) {
  const dispatch = useDispatch()
  const [sellCategory, setSellCategory] = useState([]) // 선택 토글 배열

  useEffect(() => {
    dispatch(fetchItemsThunk({ sellCategory }))
  }, [dispatch, sellCategory])

  const handleSelect = (value) => {
    setSellCategory((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleReset = () => setSellCategory([]) // ← '' 말고 빈 배열로 초기화!

  const Button = ({ value }) => (
    <button
      type="button"
      className={`btn ${sellCategory.includes(value) ? 'active' : ''}`}
      onClick={() => handleSelect(value)}
      aria-pressed={sellCategory.includes(value)}
    >
      {value}
    </button>
  )

  // 디버그 로그 (배포전 삭제)
  console.log('🎀items:', items)
  console.log('🎀sellCategory:', sellCategory)

  return (
    <section id="item-search-tap" style={{ marginTop: 200 }}>
      {/* 전체 초기화 */}
      <div style={{ marginBottom: 16 }}>
        <button type="button" className="btn" onClick={handleReset}>전체</button>
      </div>

      <div className="filter-group">
        <h3>반려동물</h3>
        <Button value="강아지" />
        <Button value="고양이" />
        <Button value="햄스터" />
        <Button value="고슴도치" />
        <Button value="토끼" />
        <Button value="새(앵무새)" />
        <Button value="물고기/기타동물" />
      </div>

      <div className="filter-group">
        <h3>추천</h3>
        <Button value="무료배송" />
        <Button value="이벤트" />
        <Button value="SEASON" />
        <Button value="빠른배송" />
        <Button value="기획전" />
        <Button value="이월상품" />
      </div>

      <div className="filter-group">
        <h3>카테고리</h3>
        <Button value="사료" />
        <Button value="간식" />
        <Button value="의류" />
        <Button value="산책용품" />
        <Button value="장난감" />
        <Button value="배변용품" />
        <Button value="기타용품" />
      </div>
    </section>
  )
}

export default ItemSearchTap
