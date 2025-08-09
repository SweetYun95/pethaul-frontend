import { Box, Typography } from '@mui/material'

function Profile({ user }) {
   return (
      <>
         <Box>
            <Typography>PROFILE</Typography>
            <Box>
               {/* 이미지 삽입 필요함 */}
               <Typography variant="h6">{user?.name}</Typography>
               <Typography>{user?.email}</Typography>
               <Typography variant="caption">{user?.role}</Typography>
            </Box>
         </Box>
      </>
   )
}

export default Profile
