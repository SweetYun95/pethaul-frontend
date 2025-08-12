import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createPetThunk, getUserPetsThunk } from '../features/petSlice'
import { Box, TextField, MenuItem, Button, Typography, Stack, Card, CardMedia } from '@mui/material'

const PetCreatePage = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { user } = useSelector((s) => s.auth)

   const [form, setForm] = useState({
      petName: '',
      petType: '',
      breed: '',
      gender: '', // 빈값 시작
      age: '',
   })
   const [files, setFiles] = useState([])

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
      fd.append('gender', form.gender) // ''도 전송됨
      fd.append('age', form.age)
      files.forEach((f) => fd.append('img', f))

      await dispatch(createPetThunk(fd)).unwrap()
      if (user?.id) await dispatch(getUserPetsThunk(user.id))
      alert('등록 완료!')
      navigate('/mypage')
   }

   return (
      <Box maxWidth={720} mx="auto" p={3} component="form" onSubmit={handleSubmit}>
         <Typography variant="h5" mb={2}>
            반려동물 등록
         </Typography>

         <Stack spacing={3}>
            <TextField label="이름" name="petName" value={form.petName} onChange={handleChange} required fullWidth />

            <TextField label="동물 종류" name="petType" value={form.petType} onChange={handleChange} placeholder="예: 강아지 / 고양이" fullWidth />

            <TextField label="품종" name="breed" value={form.breed} onChange={handleChange} placeholder="예: 푸들 / 코리안숏헤어" fullWidth />

            <TextField
               select
               label="성별"
               name="gender"
               value={form.gender}
               onChange={handleChange}
               fullWidth
               // 선택값 표시도 안전하게 텍스트로 변환
               SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected) => {
                     if (!selected) return '성별 선택'
                     return selected === 'M' ? '남' : '여'
                  },
                  MenuProps: {
                     PaperProps: {
                        sx: {
                           bgcolor: '#fff', // 메뉴 배경을 확실히 흰색
                           color: '#111', // 메뉴 안의 기본 텍스트 색
                           '& .MuiMenuItem-root': {
                              color: '#111', // 각 아이템 텍스트 색 강제
                              fontSize: 16, // 혹시 폰트가 0으로 덮였을 경우 대비
                           },
                        },
                     },
                  },
               }}
               sx={{
                  '& .MuiSelect-select': { color: '#111' }, // 선택된 값 텍스트 색
                  '& .MuiInputLabel-root': { color: '#111' }, // 라벨 색
               }}
            >
   
               <MenuItem value="M">남</MenuItem>
               <MenuItem value="F">여</MenuItem>
            </TextField>

            <TextField label="나이" name="age" type="number" inputProps={{ min: 0 }} value={form.age} onChange={handleChange} fullWidth />

            <Stack direction="row" spacing={2} alignItems="center">
               <Button variant="outlined" component="label">
                  이미지 선택
                  <input type="file" hidden multiple accept="image/*" onChange={handleFiles} />
               </Button>
               <Typography variant="body2">{files.length ? `${files.length}장 선택됨` : ''}</Typography>
            </Stack>

            {/* 미리보기 */}
            <Stack direction="row" spacing={2} flexWrap="wrap">
               {previews.map((src, i) => (
                  <Card key={i} sx={{ width: 120, height: 120, overflow: 'hidden' }}>
                     <CardMedia component="img" height={120} image={src} />
                  </Card>
               ))}
            </Stack>

            <Box>
               <Button type="submit" variant="contained">
                  등록하기
               </Button>
            </Box>
         </Stack>
      </Box>
   )
}

export default PetCreatePage
