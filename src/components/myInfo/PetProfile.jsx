// src/components/myInfo/PetProfile.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUserPetsThunk } from '../../features/petSlice'
import { Box, Card, CardMedia, CardContent, Typography, Chip, Button, Grid, Stack } from '@mui/material'

const PetProfile = () => {
   const dispatch = useDispatch()
   const { user } = useSelector((s) => s.auth)
   const { pets, loading, error } = useSelector((s) => s.pet)

   useEffect(() => {
      if (user?.id) dispatch(getUserPetsThunk(user.id))
   }, [dispatch, user?.id])

   if (loading) return <Typography>반려동물 불러오는 중…</Typography>
   if (error) return <Typography color="error">에러: {error}</Typography>

   // 업로드 이미지가 있을 때만 백엔드 주소를 붙임
   const getRepImg = (p) => {
      const base = import.meta.env.VITE_APP_API_URL || ''
      const uploaded = p.images?.find((i) => i.isPrimary)?.imgUrl || p.images?.[0]?.imgUrl
        || '/uploads/no-image.jpg';
      if (uploaded) return `${base}${uploaded}`
      // 기본 이미지는 프론트 public 폴더 사용 (백엔드 주소 X)
      return '/images/no-image.jpg'
   }

   const genderLabel = (g) => (g === 'M' ? '남' : g === 'F' ? '여' : '-')

   if (!pets || pets.length === 0) {
      return (
         <Box mt={3}>
            <Typography mb={1}>등록된 반려동물이 없습니다.</Typography>
            <Button component={Link} to="/pets" variant="contained" size="small">
               반려동물 등록하기
            </Button>
         </Box>
      )
   }

   return (
      <Box mt={3}>
         <Typography variant="h6" mb={2}>
            반려동물 프로필
         </Typography>
         <Grid container spacing={2}>
            {pets.map((p) => (
               <Grid item xs={12} sm={6} md={4} key={p.id}>
                  <Card>
                     <CardMedia component="img" height="180" image={getRepImg(p)} alt={p.petName} />
                     <CardContent>
                        <Typography variant="h6">{p.petName}</Typography>
                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                           <Chip size="small" label={`${p.petType} / ${p.breed}`} />
                           <Chip size="small" label={`나이 ${p.age}`} />
                           <Chip size="small" label={`성별 ${genderLabel(p.gender)}`} />
                        </Stack>
                        <Box mt={2} textAlign="right">
                           <Button component={Link} to={`/pets/${p.id}/edit`} variant="outlined" size="small">
                              정보 수정
                           </Button>
                        </Box>
                     </CardContent>
                  </Card>
               </Grid>
            ))}
         </Grid>
      </Box>
   )
}

export default PetProfile
