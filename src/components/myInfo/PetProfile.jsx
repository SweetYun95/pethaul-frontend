// src/components/myInfo/PetProfile.jsx
import { useMemo } from 'react'
import { Box, Card, CardMedia, CardContent, Typography, Chip, Button, Stack } from '@mui/material'

const PetProfile = ({ pet }) => {
   const base = useMemo(() => import.meta.env.VITE_APP_API_URL || '', [])
   const repImg = (() => {
      const img = pet.images?.find((i) => i.isPrimary)?.imgUrl || pet.images?.[0]?.imgUrl || '/images/no-image.jpg'
      return img.startsWith('/images/')
         ? img // 앱의 정적 no-image
         : `${base}${img}` // 서버 이미지
   })()
   const genderLabel = (g) => (g === 'M' ? '남' : g === 'F' ? '여' : '-')
   return (
      <Card>
         <CardMedia component="img" height="180" image={repImg} alt={pet.petName} />
         <CardContent>
            <Typography variant="h6">{pet.petName}</Typography>
            <Stack direction="row" spacing={1} mt={1}>
               <Chip size="small" label={`${pet.petType} / ${pet.breed}`} />
               <Chip size="small" label={`나이 ${pet.age}`} />
               <Chip size="small" label={`성별 ${genderLabel(pet.gender)}`} />
            </Stack>
         </CardContent>
      </Card>
   )
}
export default PetProfile
