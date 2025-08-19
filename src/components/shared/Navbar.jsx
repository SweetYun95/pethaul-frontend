// src/components/shared/Navbar.jsx
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'

import { logoutUserThunk } from '../../features/authSlice'

import '../css/shared/Navbar_v-ysy.css'

/**
 * ✅ useLocation 기반 인증 체크 단일화 전략
 * - 인증 상태 체크는 App(AuthGate) 한 곳에서만 수행
 * - Navbar는 전역 상태를 소비만 한다 (중복 디스패치 금지)
 * - 팀원 변경사항 반영: 로그아웃 시 확인창 + 홈으로 navigate('/').
 */
function Navbar() {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const { isAuthenticated, user } = useSelector((state) => state.auth)

   const [anchorEl, setAnchorEl] = useState(null)
   const open = Boolean(anchorEl)

   const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
   const handleMenuClose = () => setAnchorEl(null)

   const handleLogin = () => {
      navigate('/login')
      handleMenuClose()
   }

   // ✅ 팀원 코드 병합: confirm → logout → alert → 홈으로 이동
   const handleLogout = () => {
      const res = confirm('로그아웃하시겠습니까?')
      if (!res) return
      dispatch(logoutUserThunk())
      handleMenuClose()
      alert('성공적으로 로그아웃했습니다.')
      navigate('/')
   }

   const isGoogleUser = user?.provider === 'google'
   const isAdmin = user?.role === 'ADMIN'

   return (
      <AppBar position="fixed" color="transparent" sx={{ backgroundColor: 'transparent', color: '#000', boxShadow: 'none' }}>
         <Container maxWidth="xl">
            <Toolbar sx={{ margin: '0 auto', justifyContent: 'space-between', maxWidth: '1200px' }}>
               <NavLink to="/" className="galindo logo">
                  PETHAUL
               </NavLink>

               <ul>
                  <li>
                     <NavLink>MENU</NavLink>
                  </li>
                  <li>
                     <NavLink>
                        SEASON
                        <iconify-icon icon="fluent-emoji-flat:watermelon" width="16" height="16" style={{ marginLeft: '5px' }}></iconify-icon>
                     </NavLink>
                  </li>
                  <li>
                     <NavLink>
                        이벤트/기획전
                        <iconify-icon icon="fluent-emoji:star" width="16" height="16" style={{ marginLeft: '5px' }}></iconify-icon>
                     </NavLink>
                  </li>
                  <li>
                     <NavLink>고객센터</NavLink>
                  </li>
               </ul>

               <div className="right-icon-bar">
                  <div className="pc-search-icon search">
                     <IconButton>
                        <iconify-icon icon="pixelarticons:search" width="24" height="24"></iconify-icon>
                     </IconButton>
                  </div>
                  <div className="mob-search-icon search">
                     <IconButton>
                        <iconify-icon icon="pixelarticons:search" width="28" height="28"></iconify-icon>
                     </IconButton>
                  </div>

                  <div className="icon">
                     <IconButton onClick={() => navigate('/likes/item')}>
                        <iconify-icon icon="pixelarticons:heart" width="24" height="24"></iconify-icon>
                     </IconButton>
                     <IconButton onClick={() => navigate('/cart')}>
                        <iconify-icon icon="streamline-pixel:shopping-shipping-basket" width="24" height="24"></iconify-icon>
                     </IconButton>

                     <IconButton onClick={handleMenuOpen}>
                        <iconify-icon icon="streamline-pixel:user-single-aim" width="24" height="24"></iconify-icon>
                     </IconButton>

                     <Popper open={open} anchorEl={anchorEl} role={undefined} placement="bottom-end" transition disablePortal>
                        {({ TransitionProps }) => (
                           <Grow {...TransitionProps}>
                              <Paper elevation={4} sx={{ mt: 1.5, borderRadius: 2, padding: '8px 0', minWidth: 120, backgroundColor: '#fff' }}>
                                 <ClickAwayListener onClickAway={handleMenuClose}>
                                    <Stack spacing={1}>
                                       {isAuthenticated ? (
                                          <>
                                             <MenuItem onClick={handleLogout} sx={{ fontSize: 14, padding: '6px 16px' }}>
                                                로그아웃
                                             </MenuItem>
                                             <MenuItem
                                                onClick={() => {
                                                   navigate('/mypage')
                                                }}
                                                sx={{ fontSize: 14, padding: '6px 16px' }}
                                             >
                                                마이페이지
                                             </MenuItem>
                                             {isAdmin && (
                                                <>
                                                   <MenuItem
                                                      onClick={() => {
                                                         navigate('/admin')
                                                      }}
                                                      sx={{ fontSize: 14, padding: '6px 16px' }}
                                                   >
                                                      관리자 페이지
                                                   </MenuItem>
                                                   {!isGoogleUser && (
                                                      <MenuItem
                                                         onClick={() => {
                                                            navigate('/items/create')
                                                         }}
                                                         sx={{ fontSize: 14, padding: '6px 16px' }}
                                                      >
                                                         상품 등록
                                                      </MenuItem>
                                                   )}
                                                </>
                                             )}
                                          </>
                                       ) : (
                                          <MenuItem onClick={handleLogin} sx={{ fontSize: 14, padding: '6px 16px' }}>
                                             로그인
                                          </MenuItem>
                                       )}
                                    </Stack>
                                 </ClickAwayListener>
                              </Paper>
                           </Grow>
                        )}
                     </Popper>
                  </div>
                  <div className="mobile-menu">
                     <iconify-icon icon="streamline-pixel:interface-essential-navigation-menu-3" width="35" height="35"></iconify-icon>
                  </div>
               </div>
            </Toolbar>
         </Container>
      </AppBar>
   )
}

export default Navbar
