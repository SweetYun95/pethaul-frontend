import { Box, Link, Container, Stack } from '@mui/material'


function Footer() {
   return (
      <Box component="footer" sx={{ backgroundColor: '#FFFDE9', borderTop: '1px solid #D8D8D8', py: 4 }}>
         <Container maxWidth="lg">
            {/* 1번째 줄: 상단 영역 */}
            <Box
               sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                  pb: 2,
                  borderBottom: '1px solid #D8D8D8',
               }}
            >
               {/* 좌측: 링크들 */}
               <Stack direction="row" spacing={3} flexWrap="wrap" style={{fontSize: '13px'}}>
                  <Link href="/" underline="none" color="inherit">
                     이용약관
                  </Link>
                  <Link href="/" underline="none" color="inherit">
                     개인정보처리방침
                  </Link>
                  <Link href="/" underline="none" color="inherit">
                     ABOUT US
                  </Link>
                  <Link href="/" underline="none" color="inherit">
                     공지사항
                  </Link>
               </Stack>

               {/* 우측: SNS 아이콘 */}
               <Stack direction="row" spacing={2}>
                  <Link href="https://facebook.com" target="_blank" color="inherit">
                     <iconify-icon icon="streamline-pixel:logo-social-media-facebook-circle" width="30" height="30"></iconify-icon>
                  </Link>
                  <Link href="https://youtube.com" target="_blank" color="inherit">
                    <iconify-icon icon="streamline-pixel:logo-social-media-youtube-circle" width="30" height="30"></iconify-icon>
                  </Link>
                  <Link href="https://instagram.com" target="_blank" color="inherit">
                     <iconify-icon icon="streamline-pixel:logo-social-media-instagram" width="30" height="30"></iconify-icon>
                  </Link>
               </Stack>
            </Box>

            {/* 2번째 줄: 하단 영역 */}
            <Box sx={{ pt: 3 }}>
               <Box
                  sx={{
                     display: 'flex',
                     flexDirection: { xs: 'column', sm: 'row' },
                     alignItems: { xs: 'flex-start', sm: 'center' },
                     justifyContent: 'space-between',
                     flexWrap: 'wrap',
                     rowGap: 1,
                  }}
               >
                  <Box>
                     <p className='galindo'>
                        PETHAUL<span style={{fontSize: '13px'}}>(주)</span>
                     </p>
                     <button style={{all: 'unset', fontSize:'11px'}}>
                        사업자정보 <iconify-icon icon="pixel:angle-down" width="13" height="13"></iconify-icon>
                     </button>
                  </Box>
               </Box>

               {/* CopyRight */}
               <p style={{fontSize: '11px'}}>
                  © 2024 SHOPMAX. All rights reserved.
               </p>
            </Box>
         </Container>
      </Box>
   )
}

export default Footer
