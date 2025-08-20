// src/components/shared/Navbar.jsx
import { useEffect, useState, useCallback, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'

import { logoutUserThunk } from '../../features/authSlice'
import ItemSearchTap from '../item/ItemSearchTap'
import '../css/shared/Navbar_v-ysy.css'

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((s) => s.auth)
  const isGoogleUser = user?.provider === 'google'
  const isAdmin = user?.role === 'ADMIN'

  // 데스크탑 시작 브레이크포인트(px) — 프로젝트 기준 맞춰 조정
  const BREAKPOINT = 768

  // -----------------------------
  // 검색 말풍선
  // -----------------------------
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchOwner, setSearchOwner] = useState(null) // 'pc' | 'mob' | null
  const [query, setQuery] = useState('')

  const pcAnchorRef = useRef(null)
  const mobAnchorRef = useRef(null)
  const searchBubbleRef = useRef(null)

  const openSearchAt = (owner) => {
    // A패치: 검색 열면 나머지 닫기
    closeMenu(); closeUserMenu()
    setSearchOwner(owner)
    setSearchOpen((prev) => (owner === searchOwner ? !prev : true))
  }
  const closeSearch = useCallback(() => {
    setSearchOpen(false)
    setSearchOwner(null)
  }, [])

  // 검색 꼬리 위치 보정 (CSS var --arrow-right)
  const updateSearchArrow = useCallback(() => {
    const anchor = searchOwner === 'pc' ? pcAnchorRef.current : mobAnchorRef.current
    const bubble = searchBubbleRef.current
    if (!anchor || !bubble) return
    const iconBtn = anchor.querySelector('button, [role="button"]')
    if (!iconBtn) return

    const iconRect = iconBtn.getBoundingClientRect()
    const bubbleRect = bubble.getBoundingClientRect()
    const arrowHalf = 6
    const iconCenterX = iconRect.left + iconRect.width / 2
    const rightPx = Math.max(8, bubbleRect.right - iconCenterX - arrowHalf)
    bubble.style.setProperty('--arrow-right', `${Math.round(rightPx)}px`)
  }, [searchOwner])

  // -----------------------------
  // 유저 메뉴
  // -----------------------------
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userAnchorRef = useRef(null)
  const userMenuRef = useRef(null)

  const openUserMenu = () => {
    // A패치: 유저 열면 나머지 닫기
    closeMenu(); closeSearch()
    setUserMenuOpen((v) => !v)
  }
  const closeUserMenu = useCallback(() => setUserMenuOpen(false), [])

  const updateUserArrow = useCallback(() => {
    const anchor = userAnchorRef.current
    const menuEl = userMenuRef.current
    if (!anchor || !menuEl) return
    const iconBtn = anchor.querySelector('button, [role="button"]')
    if (!iconBtn) return

    const iconRect = iconBtn.getBoundingClientRect()
    const menuRect = menuEl.getBoundingClientRect()
    const arrowHalf = 6
    const iconCenterX = iconRect.left + iconRect.width / 2
    const rightPx = Math.max(8, menuRect.right - iconCenterX - arrowHalf)
    menuEl.style.setProperty('--arrow-right', `${Math.round(rightPx)}px`)
  }, [])

  // -----------------------------
  // 메인 MENU 드롭다운 (PC/Mobile 공용)
  // -----------------------------
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuOwner, setMenuOwner] = useState(null) // 'pc' | 'mob' | null
  const pcMenuAnchorRef = useRef(null)
  const mobMenuAnchorRef = useRef(null)
  const menuRef = useRef(null)

  const openMenuAt = (owner) => {
    // A패치: 메뉴 열면 나머지 닫기
    closeSearch(); closeUserMenu()
    setMenuOwner(owner)
    setMenuOpen((prev) => (owner === menuOwner ? !prev : true))
  }
  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    setMenuOwner(null)
  }, [])

  const updateMenuArrow = useCallback(() => {
    const anchor =
      menuOwner === 'pc' ? pcMenuAnchorRef.current : menuOwner === 'mob' ? mobMenuAnchorRef.current : null
    const menuEl = menuRef.current
    if (!anchor || !menuEl) return
    const iconBtn = anchor.querySelector('a, button, [role="button"]') || anchor
    const iconRect = iconBtn.getBoundingClientRect()
    const menuRect = menuEl.getBoundingClientRect()
    const arrowHalf = 6
    const iconCenterX = iconRect.left + iconRect.width / 2
    const rightPx = Math.max(8, menuRect.right - iconCenterX - arrowHalf)
    menuEl.style.setProperty('--arrow-right', `${Math.round(rightPx)}px`)
  }, [menuOwner])

  // -----------------------------
  // 공통: 리사이즈/스크롤/바깥클릭 + 브레이크포인트 동기화
  // -----------------------------
  useEffect(() => {
    // 브레이크포인트 전환 시 반대 레이아웃의 메뉴 닫기
    const syncByBreakpoint = () => {
      const w = window.innerWidth
      const isDesktop = w >= BREAKPOINT
      const isMobile = !isDesktop

      if (menuOpen && menuOwner === 'mob' && isDesktop) {
        closeMenu()
      }
      if (menuOpen && menuOwner === 'pc' && isMobile) {
        closeMenu()
      }
    }

    if (searchOpen) requestAnimationFrame(updateSearchArrow)
    if (userMenuOpen) requestAnimationFrame(updateUserArrow)
    if (menuOpen) requestAnimationFrame(updateMenuArrow)
    // mount 시 1회 동기화
    syncByBreakpoint()

    const onResize = () => {
      syncByBreakpoint()
      if (searchOpen) updateSearchArrow()
      if (userMenuOpen) updateUserArrow()
      if (menuOpen) updateMenuArrow()
    }
    const onScroll = () => {
      if (searchOpen) updateSearchArrow()
      if (userMenuOpen) updateUserArrow()
      if (menuOpen) updateMenuArrow()
    }
    const onDown = (e) => {
      // 검색
      const sB = searchBubbleRef.current
      const pcA = pcAnchorRef.current
      const mobA = mobAnchorRef.current
      const inSearch = sB?.contains(e.target) || pcA?.contains(e.target) || mobA?.contains(e.target)
      if (!inSearch) closeSearch()

      // 유저
      const uA = userAnchorRef.current
      const uM = userMenuRef.current
      const inUser = uM?.contains(e.target) || uA?.contains(e.target)
      if (!inUser) closeUserMenu()

      // 메뉴 (PC/Mob 공용)
      const mPcA = pcMenuAnchorRef.current
      const mMobA = mobMenuAnchorRef.current
      const mM = menuRef.current
      const inMenu = mM?.contains(e.target) || mPcA?.contains(e.target) || mMobA?.contains(e.target)
      if (!inMenu) closeMenu()
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    window.addEventListener('scroll', onScroll, true)
    document.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      window.removeEventListener('scroll', onScroll, true)
      document.removeEventListener('mousedown', onDown)
    }
  }, [
    BREAKPOINT,
    searchOpen, userMenuOpen, menuOpen, menuOwner,
    updateSearchArrow, updateUserArrow, updateMenuArrow,
    closeSearch, closeUserMenu, closeMenu,
  ])

  // -----------------------------
  // 액션
  // -----------------------------
  const submitSearch = () => {
    const q = query.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setQuery('')
    closeSearch()
  }

  const handleLogin = () => { navigate('/login'); closeUserMenu() }
  
     const handleJoin = () => {
      navigate('/join')
      closeUserMenu()
   }
  
  const handleLogout = () => {
    if (!confirm('로그아웃하시겠습니까?')) return
    dispatch(logoutUserThunk())
    closeUserMenu()
    alert('성공적으로 로그아웃했습니다.')
    navigate('/')
  }

  return (
    <AppBar position="fixed" color="transparent" elevation={0}>
      <Container>
        <section id="navbar-section">
          {/* 로고 */}
          <NavLink to="/" className="galindo logo">PETHAUL</NavLink>

          {/* 상단 메뉴 */}
          <ul>
            {/* ▼ MENU 드롭다운 (PC 앵커) */}
            <li className="nav-item" ref={pcMenuAnchorRef}>
              <NavLink
                to="#"
                onClick={(e) => { e.preventDefault(); openMenuAt('pc') }}
                aria-expanded={menuOpen && menuOwner === 'pc'}
                aria-haspopup="menu"
              >
                MENU
              </NavLink>

              {/* PC 드롭다운 */}
              {menuOpen && menuOwner === 'pc' && (
                <div
                  className="menu-dropdown-wrap is-pc"
                  ref={menuRef}
                  role="menu"
                  aria-label="Main menu"
                  onKeyDown={(e) => { if (e.key === 'Escape') closeMenu() }}
                >
                  <ItemSearchTap />
                </div>
              )}
            </li>

            <li>
              <NavLink to="/season">
                SEASON
                <iconify-icon icon="fluent-emoji-flat:watermelon" width="16" height="16" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/events">
                이벤트/기획전
                <iconify-icon icon="fluent-emoji:star" width="16" height="16" />
              </NavLink>
            </li>
            <li><NavLink to="/support">고객센터</NavLink></li>
          </ul>

          {/* 우측 아이콘 바 */}
          <div className="right-icon-bar">
            {/* 🔎 PC 검색 앵커 */}
            <div className="search-anchor pc-search-icon search" ref={pcAnchorRef}>
              <IconButton
                onClick={() => openSearchAt('pc')}
                aria-expanded={searchOpen && searchOwner === 'pc'}
                aria-haspopup="dialog"
                aria-label="검색"
              >
                <iconify-icon icon="pixelarticons:search" width="24" height="24" />
              </IconButton>

              {searchOpen && searchOwner === 'pc' && (
                <div
                  className="search-bubble"
                  ref={searchBubbleRef}
                  role="dialog"
                  aria-modal="true"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') closeSearch()
                    if (e.key === 'Enter') submitSearch()
                  }}
                >
                  <input
                    type="text"
                    className="search-input"
                    placeholder="검색어를 입력하세요"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    onFocus={updateSearchArrow}
                  />
                  <button type="button" className="search-submit" onClick={submitSearch}>
                    <iconify-icon icon="pixelarticons:arrow-right" width="18" height="18" />
                  </button>
                </div>
              )}
            </div>

            {/* 🔎 Mobile 검색 앵커 */}
            <div className="search-anchor mob-search-icon search" ref={mobAnchorRef}>
              <IconButton
                onClick={() => openSearchAt('mob')}
                aria-expanded={searchOpen && searchOwner === 'mob'}
                aria-haspopup="dialog"
                aria-label="검색"
              >
                <iconify-icon icon="pixelarticons:search" width="28" height="28" />
              </IconButton>

              {searchOpen && searchOwner === 'mob' && (
                <div
                  className="search-bubble"
                  ref={searchBubbleRef}
                  role="dialog"
                  aria-modal="true"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') closeSearch()
                    if (e.key === 'Enter') submitSearch()
                  }}
                >
                  <input
                    type="text"
                    className="search-input"
                    placeholder="검색어를 입력하세요"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    onFocus={updateSearchArrow}
                  />
                  <button type="button" className="search-submit" onClick={submitSearch}>
                    <iconify-icon icon="pixelarticons:arrow-right" width="18" height="18" />
                  </button>
                </div>
              )}
            </div>

            {/* ♥, 🧺 */}
            <div className="icon">
              <IconButton onClick={() => navigate('/likes/item')}>
                <iconify-icon icon="pixelarticons:heart" width="24" height="24" />
              </IconButton>
              <IconButton onClick={() => navigate('/cart')}>
                <iconify-icon icon="streamline-pixel:shopping-shipping-basket" width="24" height="24" />
              </IconButton>

              {/* 👤 유저 메뉴 앵커 */}
              <div className="user-anchor" ref={userAnchorRef}>
                <IconButton
                  onClick={openUserMenu}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="dialog"
                  aria-label="유저 메뉴"
                >
                  <iconify-icon icon="streamline-pixel:user-single-aim" width="24" height="24" />
                </IconButton>

                {userMenuOpen && (
                  <div
                    className="user-menu"
                    ref={userMenuRef}
                    role="dialog"
                    aria-modal="true"
                    onKeyDown={(e) => { if (e.key === 'Escape') closeUserMenu() }}
                  >
                    <div className="user-menu__arrow" />

                    <div className="user-menu__header">
                      {isAuthenticated ? (
                        <>
                          <span className="user-menu__avatar" aria-hidden="true">👤</span>
                          <div className="user-menu__meta">
                            <strong className="user-menu__name">{user?.nickname ?? user?.name ?? '사용자'}</strong>
                            <span className="user-menu__role">{isAdmin ? 'ADMIN' : 'MEMBER'}</span>
                          </div>
                        </>
                      ) : (
                        <span className="user-menu__welcome">어서오세요!</span>
                      )}
                    </div>

                    <nav className="user-menu__list" role="menu" aria-label="User menu">
                      {isAuthenticated ? (
                        <>
                          <button type="button" role="menuitem" className="user-menu__item" onClick={handleLogout}>
                            <span className="user-menu__icon">🚪</span>
                            로그아웃
                          </button>

                          <button
                            type="button"
                            role="menuitem"
                            className="user-menu__item"
                            onClick={() => { closeUserMenu(); navigate('/mypage') }}
                          >
                            <span className="user-menu__icon">🏠</span>
                            마이페이지
                          </button>

                          {isAdmin && (
                            <>
                              <div className="user-menu__divider" />
                              <button type="button" role="menuitem" className="user-menu__item" onClick={() => { closeUserMenu(); navigate('/admin') }}>
                                <span className="user-menu__icon">🛠️</span>
                                관리자 페이지
                              </button>

                              {!isGoogleUser && (
                                <button type="button" role="menuitem" className="user-menu__item" onClick={() => { closeUserMenu(); navigate('/items/create') }}>
                                  <span className="user-menu__icon">➕</span>
                                  상품 등록
                                </button>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                       <>
                                       <button type="button" role="menuitem" className="user-menu__item" onClick={handleLogin}>
                                          <span className="user-menu__icon">🔑</span>
                                          로그인
                                       </button>
                                       <button type="button" role="menuitem" className="user-menu__item" onClick={handleJoin}>
                                          <span className="user-menu__icon">📝</span>
                                          회원가입
                                       </button>
                                    </>
                      )}
                    </nav>
                  </div>
                )}
              </div>
            </div>

            {/* 📱 모바일 메뉴 아이콘 (항상 보여야 함 — 데스크탑에서 숨기려면 CSS로 제어) */}
            <div
              className="mobile-menu"
              ref={mobMenuAnchorRef}
              onClick={() => openMenuAt('mob')}
              aria-expanded={menuOpen && menuOwner === 'mob'}
              aria-haspopup="menu"
            >
              <iconify-icon icon="streamline-pixel:interface-essential-navigation-menu-3" width="35" height="35" />
            </div>

            {/* 📱 모바일 드롭다운 (menuOpen일 때만 보여야 함) */}
            {menuOpen && menuOwner === 'mob' && (
              <div
                className="menu-dropdown-wrap is-mob"
                ref={menuRef}
                role="menu"
                aria-label="Main menu"
                onKeyDown={(e) => { if (e.key === 'Escape') closeMenu() }}
              >
                {/* 닫기 버튼 */}
                <div className="menu-header">
                  <p className="galindo">MENU</p>
                  <button className="menu-close-btn" onClick={closeMenu} aria-label="메뉴 닫기">
                    ✕
                  </button>
                </div>

                <ItemSearchTap />
              </div>
            )}
          </div>
        </section>
      </Container>
    </AppBar>
  )
}

export default Navbar
