import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Link } from 'react-router-dom'
import { createPetThunk, getUserPetsThunk } from '../features/petSlice'
import { Box, TextField, MenuItem, Button, Typography, Stack, Card, CardMedia, Alert, AlertTitle, Divider, Chip } from '@mui/material'

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
   const [successPet, setSuccessPet] = useState(null) // ✅ 방금 등록한 펫

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
      files.forEach((f) => fd.append('img', f))

      // ✅ 생성 결과 받아서 successPet으로 저장
      const created = await dispatch(createPetThunk(fd)).unwrap() // { success, message, pet }
      const newPet = created?.pet
      if (user?.id) await dispatch(getUserPetsThunk(user.id))

      // 폼 초기화
      setForm({ petName: '', petType: '', breed: '', gender: '', age: '' })
      setFiles([])

      // 성공 상태 저장 → 페이지에서 즉시 미리보기
      setSuccessPet(newPet)
      // alert은 선택: UX상 Alert 컴포넌트로 대체했으므로 생략 가능
      // alert('등록 완료!')
   }

   // 이미지 베이스 URL
   const baseUrl = useMemo(() => import.meta.env.VITE_APP_API_URL || '', [])
   const getRepImg = (p) => {
      const img = p?.images?.find((i) => i.isPrimary)?.imgUrl || p?.images?.[0]?.imgUrl || '/images/no-image.jpg'
      return img.startsWith('/images/')
         ? img // 프론트 정적 이미지
         : `${baseUrl}${img}` // 서버 업로드 이미지
   }
   const genderLabel = (g) => (g === 'M' ? '남' : g === 'F' ? '여' : '-')

   return (
      <Box maxWidth={720} mx="auto" p={3} component="form" onSubmit={handleSubmit}>
         <Typography variant="h5" mb={2}>
            반려동물 등록
         </Typography>

         {/* ✅ 등록 성공 알림 & 미리보기 */}
         {successPet && (
            <Box mb={3}>
               <Alert severity="success" sx={{ mb: 2 }}>
                  <AlertTitle>등록 완료</AlertTitle>
                  <strong>{successPet.petName}</strong> 프로필이 등록되었습니다.
               </Alert>

               <Card sx={{ display: 'flex', p: 2, gap: 2, alignItems: 'center' }}>
                  <CardMedia component="img" image={getRepImg(successPet)} alt={successPet.petName} sx={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 2 }} />
                  <Box flex={1}>
                     <Typography variant="h6" mb={1}>
                        {successPet.petName}
                     </Typography>
                     <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip size="small" label={`${successPet.petType} / ${successPet.breed}`} />
                        <Chip size="small" label={`나이 ${successPet.age}`} />
                        <Chip size="small" label={`성별 ${genderLabel(successPet.gender)}`} />
                     </Stack>
                     <Stack direction="row" spacing={1} mt={2}>
                        <Button component={Link} to="/mypage" variant="contained" size="small">
                           마이페이지에서 보기
                        </Button>
                        <Button
                           variant="outlined"
                           size="small"
                           onClick={() => setSuccessPet(null)} // 다시 입력 폼만 보이게
                        >
                           다른 펫 추가하기
                        </Button>
                     </Stack>
                  </Box>
               </Card>

               <Divider sx={{ my: 3 }} />
            </Box>
         )}

         {/* ⬇️ 폼 (성공 후에도 계속 보임 / "다른 펫 추가하기"로 이어서 입력 가능) */}
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

            <Stack direction="row" spacing={2} alignItems="center">
               <Button variant="outlined" component="label">
                  이미지 선택
                  <input type="file" hidden multiple accept="image/*" onChange={handleFiles} />
               </Button>
               <Typography variant="body2">{files.length ? `${files.length}장 선택됨` : ''}</Typography>
            </Stack>

            {/* 업로드 미리보기 */}
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
