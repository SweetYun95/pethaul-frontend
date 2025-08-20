import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPetThunk, getUserPetsThunk } from '../features/petSlice'
import { Link } from 'react-router-dom'

import './css/PetCreatePage.css'

const PetCreatePage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)

  const [form, setForm] = useState({
    petName: '',
    petType: '',
    breed: '',
    gender: '',
    age: '',
  })
  const [files, setFiles] = useState([])
  const [successPet, setSuccessPet] = useState(null)

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFiles = (e) => {
    const list = Array.from(e.target.files || [])
    setFiles(list.slice(0, 10))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.petName.trim()) return alert('이름을 입력하세요.')
    if (!form.petType.trim()) return alert('동물 종류를 입력하세요.')
    if (!form.breed.trim()) return alert('품종을 입력하세요.')
    if (form.age === '' || Number(form.age) < 0) return alert('나이를 확인하세요.')
    if (!form.gender) return alert('성별을 선택하세요.')

    const fd = new FormData()
    fd.append('petName', form.petName)
    fd.append('petType', form.petType)
    fd.append('breed', form.breed)
    fd.append('gender', form.gender)
    fd.append('age', form.age)

    files.forEach((f) => {
      const safe = new File([f], encodeURIComponent(f.name), { type: f.type })
      fd.append('img', safe)
    })

    const created = await dispatch(createPetThunk(fd)).unwrap()
    const newPet = created?.pet
    if (user?.id) await dispatch(getUserPetsThunk(user.id))

    setForm({ petName: '', petType: '', breed: '', gender: '', age: '' })
    setFiles([])
    setSuccessPet(newPet)
  }

  return (
   <div className='blue-background'>
    <section id="pet-create-section">
      <h1 className='section-title'>반려동물 등록</h1>

      {/* ✅ 성공 메시지 */}
      {successPet && (
        <div className="alert-success">
          <p> 프로필이 등록되었습니다.</p>
          <div className="preview-card">
            <h3>{successPet.petName}</h3>
            <p>{successPet.petType} / {successPet.breed}</p>
            <p>나이: {successPet.age}</p>
            <p>성별: {successPet.gender === 'M' ? '남' : '여'}</p>
            <div>
            <Link to="/mypage" className="btn">마이페이지에서 보기</Link>
            <button className="btn" onClick={() => setSuccessPet(null)}>다른 펫 추가하기</button>
            </div>
          </div>
        </div>
      )}

<div className="contents-card">
        <div className="card-header">
          <div className="window-btn">
            <span className="red"></span>
            <span className="green"></span>
            <span className="blue"></span>
          </div>
          <span className="card-title">반려동물의 정보를 입력해주세요.</span>
        </div>

        <div className="pet-create-form-group">
         <div className="pet-input-group">
      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} >
      <div className="pet-form">
       <div>
        <div className='pet-input-section'>
          <p>이름</p>
          <input type="text" name="petName" value={form.petName} onChange={handleChange} placeholder='이름을 입력해주세요.' required />
        </div>

        <div className='pet-input-section'>
          <p>동물 종류</p>
          <input type="text" name="petType" value={form.petType} onChange={handleChange} placeholder="예: 강아지 / 고양이" />
        </div>

        <div className='pet-input-section'>
          <p>품종</p>
          <input type="text" name="breed" value={form.breed} onChange={handleChange} placeholder="예: 푸들 / 코리안숏헤어" />
        </div>

        <div className='pet-input-section'>
          <p>성별</p>
          <select id='pet-sell-status' name="gender" value={form.gender} onChange={handleChange}>
            <option value="">성별 선택</option>
            <option value="M">남</option>
            <option value="F">여</option>
          </select>
        </div>

        <div className='pet-input-section'>
         <p>나이</p> 
          <input type="number" name="age" value={form.age} onChange={handleChange} min="0" placeholder='0' />
        </div>
        </div>
        

        <div className='pet-input-section pet-img'>
        <div>
          <p>이미지선택</p>
          <input type="file" multiple accept="image/*" onChange={handleFiles} />
        </div>
        {files.length > 0 && <p>{files.length}장 선택됨</p>}

        <div className="preview-list">
          {previews.map((src, i) => (
            <img key={i} src={src} alt={`preview-${i}`} className="preview-img" />
          ))}
        </div>
        </div>
       </div>

        <button type="submit" className="submit-btn">등록하기</button>
       </form>
       </div>
       </div>
      </div>
    </section>
    </div>
  )
}

export default PetCreatePage
