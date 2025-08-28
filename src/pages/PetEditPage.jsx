// src/pages/PetEditPage.jsx
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { updatePetThunk, getUserPetsThunk } from '../features/petSlice'

import './css/PetPage.css'

const PetEditPage = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { state } = useLocation() // { petId, pet }
   const { user } = useSelector((s) => s.auth)

   const initial = state?.pet || null
   const petId = state?.petId || initial?.id

   // 전달된 데이터 없으면 마이페이지로
   useEffect(() => {
      if (!petId) {
         alert('수정할 반려동물 정보가 없습니다.')
         navigate('/mypage')
      }
   }, [petId, navigate])

   const [form, setForm] = useState({
      petName: initial?.petName || '',
      petType: initial?.petType || '',
      breed: initial?.breed || '',
      gender: initial?.gender || '',
      age: initial?.age ?? '',
   })
   const [file, setFile] = useState(null)
   const [successPet, setSuccessPet] = useState(null)

   useEffect(() => {
      if (initial) {
         setForm({
            petName: initial.petName || '',
            petType: initial.petType || '',
            breed: initial.breed || '',
            gender: initial.gender || '',
            age: initial.age ?? '',
         })
      }
   }, [initial])

   const baseUrl = useMemo(() => import.meta.env.VITE_APP_API_URL || '', [])
   const currentImg = initial?.images?.[0]?.imgUrl ? (initial.images[0].imgUrl.startsWith('/images/') ? initial.images[0].imgUrl : `${baseUrl}${initial.images[0].imgUrl}`) : '/images/no-image.jpg'

   const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : currentImg), [file, currentImg])

   useEffect(() => {
      return () => {
         if (file) URL.revokeObjectURL(previewUrl)
      }
   }, [file, previewUrl])

   const handleChange = (e) => {
      const { name, value } = e.target
      setForm((prev) => ({ ...prev, [name]: value }))
   }

   const handleFiles = (e) => {
      const list = Array.from(e.target.files || [])
      setFile(list[0] || null)
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!petId) return

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

      // 단일 이미지 교체
      if (file) {
         const safe = new File([file], encodeURIComponent(file.name), { type: file.type })
         fd.append('img', safe)
      }

      const updated = await dispatch(updatePetThunk({ id: petId, formData: fd })).unwrap()
      if (user?.id) await dispatch(getUserPetsThunk(user.id))

      setSuccessPet(updated?.pet || { ...form, id: petId })
   }

   return (
      <div className="blue-background">
         <section id="pet-create-section">
            <h1 className="section-title">반려동물 프로필 수정</h1>

            {/* ✅ 성공 메시지 */}
            {successPet && (
               <div className="alert-success">
                  <p>프로필이 수정되었습니다.</p>
                  <div className="preview-card">
                     <h3>{successPet.petName}</h3>
                     <p>
                        {successPet.petType} / {successPet.breed}
                     </p>
                     <p>나이: {successPet.age}</p>
                     <p>성별: {successPet.gender === 'M' ? '남' : '여'}</p>
                     <div>
                        <Link to="/mypage" className="btn">
                           마이페이지에서 보기
                        </Link>
                        <button className="btn" onClick={() => setSuccessPet(null)}>
                           다시 수정하기
                        </button>
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
                  <span className="card-title">반려동물의 정보를 수정해주세요.</span>
               </div>

               <div className="pet-create-form-group">
                  <div className="pet-input-group">
                     <form onSubmit={handleSubmit}>
                        <div className="pet-form">
                           <div>
                              <div className="pet-input-section">
                                 <p>이름</p>
                                 <input type="text" name="petName" value={form.petName} onChange={handleChange} placeholder="이름을 입력해주세요." required />
                              </div>

                              <div className="pet-input-section">
                                 <p>동물 종류</p>
                                 <input type="text" name="petType" value={form.petType} onChange={handleChange} placeholder="예: 강아지 / 고양이" />
                              </div>

                              <div className="pet-input-section">
                                 <p>품종</p>
                                 <input type="text" name="breed" value={form.breed} onChange={handleChange} placeholder="예: 푸들 / 코리안숏헤어" />
                              </div>

                              <div className="pet-input-section">
                                 <p>성별</p>
                                 <select id="pet-sell-status" name="gender" value={form.gender} onChange={handleChange}>
                                    <option value="">성별 선택</option>
                                    <option value="M">남</option>
                                    <option value="F">여</option>
                                 </select>
                              </div>

                              <div className="pet-input-section">
                                 <p>나이</p>
                                 <input type="number" name="age" value={form.age} onChange={handleChange} min="0" placeholder="0" />
                              </div>
                           </div>

                           {/* 이미지 섹션 */}
                           <div className="pet-input-section pet-img">
                              <div>
                                 <p>대표 이미지 교체</p>
                                 <input type="file" accept="image/*" onChange={handleFiles} />
                              </div>

                              <div className="preview-list">
                                 <img src={previewUrl} alt="preview" className="preview-img" />
                              </div>
                           </div>
                        </div>

                        <button type="submit" className="submit-btn">
                           저장하기
                        </button>
                     </form>
                  </div>
               </div>
            </div>
         </section>
      </div>
   )
}

export default PetEditPage
