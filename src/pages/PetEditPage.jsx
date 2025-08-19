// src/pages/PetEditPage.jsx
import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { updatePetThunk, getUserPetsThunk } from '../features/petSlice'
import { Box, TextField, MenuItem, Button, Typography, Stack, Card, CardMedia } from '@mui/material'

const PetEditPage = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { state } = useLocation() // { petId, pet }
   const initial = state?.pet || null
   const petId = state?.petId || initial?.id

   // 전달된 데이터가 없으면 마이페이지로 안내
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
   const [file, setFile] = useState(null) // ✅ 단일 파일

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

   // 기존 대표 이미지
   const currentImg = initial?.images?.[0]?.imgUrl ? (initial.images[0].imgUrl.startsWith('/images/') ? initial.images[0].imgUrl : `${baseUrl}${initial.images[0].imgUrl}`) : '/images/no-image.jpg'

   // 파일 선택 (한 장만)
   const handleFiles = (e) => {
      const list = Array.from(e.target.files || [])
      setFile(list[0] || null)
   }

   const handleChange = (e) => {
      const { name, value } = e.target
      setForm((prev) => ({ ...prev, [name]: value }))
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!petId) return

      const fd = new FormData()
      fd.append('petName', form.petName)
      fd.append('petType', form.petType)
      fd.append('breed', form.breed)
      fd.append('gender', form.gender)
      fd.append('age', form.age)

      // ✅ 단일 파일 교체 시에도 동일 처리
      if (file) {
         const safe = new File([file], encodeURIComponent(file.name), { type: file.type }) // ★
         fd.append('img', safe) // ★ 세 번째 인자(파일명) 쓰지 마세요
      }

      await dispatch(updatePetThunk({ id: petId, formData: fd })).unwrap()
      await dispatch(getUserPetsThunk()) // 목록 갱신
      alert('수정되었습니다.')
      navigate('/mypage')
   }

   // 미리보기: 새 파일 선택 시 그걸, 아니면 기존 대표 이미지
   const previewUrl = file ? URL.createObjectURL(file) : currentImg

   return (
      <Box maxWidth={720} mx="auto" p={3} component="form" onSubmit={handleSubmit}>
         <Typography variant="h5" mb={2}>
            반려동물 프로필 편집
         </Typography>

         {/* 대표 이미지 미리보기 (단일) */}
         <Card sx={{ width: 200, height: 200, mb: 1.5, overflow: 'hidden' }}>
            <CardMedia component="img" height={200} image={previewUrl} onLoad={() => file && URL.revokeObjectURL(previewUrl)} />
         </Card>
         <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}></Typography>

         <Stack spacing={3}>
            <TextField label="이름" name="petName" value={form.petName} onChange={handleChange} required fullWidth />
            <TextField label="동물 종류" name="petType" value={form.petType} onChange={handleChange} fullWidth />
            <TextField label="품종" name="breed" value={form.breed} onChange={handleChange} fullWidth />

            <TextField
               select
               label="성별"
               name="gender"
               value={form.gender}
               onChange={handleChange}
               fullWidth
               SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected) => (!selected ? '성별 선택' : selected === 'M' ? '남' : '여'),
               }}
            >
               <MenuItem value="">성별 선택</MenuItem>
               <MenuItem value="M">남</MenuItem>
               <MenuItem value="F">여</MenuItem>
            </TextField>

            <TextField label="나이" name="age" type="number" inputProps={{ min: 0 }} value={form.age} onChange={handleChange} fullWidth />

            {/* ✅ 단일 파일 입력 */}
            <Stack direction="row" spacing={2} alignItems="center">
               <Button variant="outlined" component="label">
                  이미지 교체(1장)
                  <input type="file" hidden accept="image/*" onChange={handleFiles} />
               </Button>
               <Typography variant="body2">{file ? `선택됨: ${file.name}` : '선택된 파일 없음'}</Typography>
            </Stack>

            <Box>
               <Button type="submit" variant="contained">
                  저장
               </Button>
               <Button sx={{ ml: 1 }} variant="text" onClick={() => navigate(-1)}>
                  취소
               </Button>
            </Box>
         </Stack>
      </Box>
   )
}

export default PetEditPage
