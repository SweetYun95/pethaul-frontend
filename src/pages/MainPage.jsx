// src/pages/MainPage.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { fetchItemsThunk, fetchSortDataThunk } from '../features/itemSlice'
import { fetchContentsThunk as fetchPostsThunk } from '../features/contentSlice'
import { fetchNewReviewsThunk, selectReviewList } from '../features/reviewSlice'

import NewContentsSlider from '../components/slider/NewContentsSlider'
import ReviewSlider from '../components/slider/ReviewSlider'

import './css/Main.css'
import { createSelector } from '@reduxjs/toolkit'

// API 이미지 절대경로/상대경로 모두 커버
const API = (`${import.meta.env.VITE_APP_API_URL}` || '').replace(/\/$/, '')
const buildImg = (u) => (u?.startsWith('http') ? u : `${API}${u?.startsWith('/') ? '' : '/'}${u || ''}`)

function MainPage() {
   const dispatch = useDispatch()
   const fetchedRef = useRef(false)
   const navigate = useNavigate()

   // 로컬 상태로 요청 진행/에러 관리
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)

   //  메인 데이터만 구독 (list/검색 상태, 전역 loading 변화에 영향 안 받음)
   const mainData = useSelector((s) => s.item.main)

   const { topSales, topToday, newItems } = useMemo(
      () => ({
         topSales: mainData?.topSales ?? [],
         topToday: mainData?.topToday ?? [],
         newItems: mainData?.newItems ?? [],
      }),
      [mainData]
   )
   // NEW CONTENTS용
   const posts = useSelector((s) => s.content?.posts ?? [])

   // REVIEWS용 (둘 중 하나 택1)
   const reviews = useSelector(selectReviewList, shallowEqual)

   // <댕댕이 장마 대비존> 섹션 데이터
   const selectEventData = createSelector(
      (state) => state.item.items,
      (items) => items.slice(0, 4)
   )
   const eventData = useSelector(selectEventData)

   // ✅ StrictMode(개발모드) 중복호출 가드 + 로딩/에러 분리
   useEffect(() => {
      if (fetchedRef.current) return
      fetchedRef.current = true
      ;(async () => {
         try {
            await Promise.allSettled([dispatch(fetchSortDataThunk(5)), dispatch(fetchItemsThunk({ sellCategory: ['강아지/장마'] })), dispatch(fetchPostsThunk()), dispatch(fetchNewReviewsThunk({ page: 1, size: 6 }))])
         } catch (e) {
            setError(e?.message || '데이터를 불러오지 못했습니다.')
         } finally {
            setLoading(false)
         }
      })()
   }, [dispatch])

   // 1) 네트워크 요청 중
   if (loading) return <p>로딩 중...</p>

   // 2) 에러
   if (error) return <p style={{ color: 'crimson' }}>오류: {String(error)}</p>

   // 3) 요청은 끝났지만 비어 있음 (빈 상태 UI)
   const total = topSales.length + topToday.length + newItems.length
   if (!mainData || total === 0) {
      return (
         <main>
            <div className="main">
               <section style={{ padding: '40px', textAlign: 'center' }}>
                  <h2>아직 보여줄 아이템이 없어요</h2>
                  <p>조금 뒤에 다시 시도하거나, 필터를 바꿔보세요.</p>
               </section>
            </div>
         </main>
      )
   }

   return (
      <main>
         <div className="main">
            {/* 메인 배너 이미지 */}
            <section id="banner">
               <div className="galindo banner-title">
                  2025
                  <br />
                  PETHAUL
                  <br />
                  SUMMER FESTIVAL
               </div>
               <button className="bannerbtn">여름나기 꿀템 더보기</button>
               {/*  public 이미지는 절대경로(/images/...)로 */}
               <img className="img1" src="/images/복냥이.png" alt="bannerimg" />
               <img className="img2" src="/images/7.png" alt="bannerimg" />
               <img className="img3" src="/images/3.png" alt="bannerimg" />
               <img className="img4" src="/images/5.png" alt="bannerimg" />
               <img className="img5" src="/images/6.png" alt="bannerimg" />
               <img className="img6" src="/images/발바닥.png" alt="bannerimg" />
               <img className="img7" src="/images/발바닥.png" alt="bannerimg" />
               <img className="img8" src="/images/수박냥이.png" alt="bannerimg" />
               <img className="img9" src="/images/어항냥이.png" alt="bannerimg" />
               <img className="img10" src="/images/빙냥이.png" alt="bannerimg" />
               <div className="click">
                  <img className="click-img" src="/images/발.png" alt="bannerimg" />
                  <p className="click-text">click!</p>
               </div>
            </section>

            {/* 오늘의 BEST */}
            <section id="best-products">
               <div className="section-title">
                  <p>
                     오늘의 BEST HAUL
                     <iconify-icon style={{ marginLeft: '10px' }} icon="streamline-pixel:entertainment-events-hobbies-reward-winner-talent" width="32" height="32" />
                  </p>
                  <Link className="more-btn" to="/items/sorted?sort=topToday">
                     More <iconify-icon icon="pixel:angle-right" width="13" height="13" />
                  </Link>
               </div>

               <div className="card-list" style={{ marginTop: '10px' }}>
                  {topToday.map((item) => {
                     const id = item.itemId ?? item.id
                     return (
                        <div key={id} className="card">
                           <Link to={`/items/detail/${id}`}>
                              <img height="160" src={buildImg(item.ItemImages[0].imgUrl)} alt={item.itemNm} />
                              <div className="card-text">
                                 <p>{item.itemNm}</p>
                                 <p>{item.price}원</p>
                              </div>
                           </Link>
                        </div>
                     )
                  })}
               </div>
            </section>

            {/* 너에 대해 알려줄래? */}
            <section id="pet-selector">
               <h1>너에 대해 알려줄래? </h1>
               <p>종류를 선택해 주세요!</p>
               <div className="pet-list">
                  <div
                     className="pet-card"
                     onClick={() => {
                        navigate('items/search?filter=강아지')
                     }}
                  >
                     <img className="pet-img1 image" src="/images/강아지.png" alt="강아지" />
                     <p>강아지</p>
                  </div>
                  <div
                     className="pet-card"
                     onClick={() => {
                        navigate('items/search?filter=햄스터')
                     }}
                  >
                     <img className="pet-img2 image" src="/images/햄스터.png" alt="햄스터" />
                     <p>햄스터</p>
                  </div>
                  <div
                     className="pet-card"
                     onClick={() => {
                        navigate('items/search?filter=고슴도치')
                     }}
                  >
                     <img className="pet-img3 image" src="/images/고슴도치.png" alt="고슴도치" />
                     <p>고슴도치</p>
                  </div>
                  <div
                     className="pet-card"
                     onClick={() => {
                        navigate('items/search?filter=새(앵무새)')
                     }}
                  >
                     <img className="pet-img3 image" src="/images/새.png" alt="새" />
                     <p>새(앵무새)</p>
                  </div>
                  <div
                     className="pet-card"
                     onClick={() => {
                        navigate('items/search?filter=고양이')
                     }}
                  >
                     <img className="pet-img3 image" src="/images/고양이.png" alt="고양이" />
                     <p>고양이</p>
                  </div>
                  <div
                     className="pet-card"
                     onClick={() => {
                        navigate('items/search?filter=토끼')
                     }}
                  >
                     <img className="pet-img3 image" src="/images/토끼.png" alt="토끼" />
                     <p>토끼</p>
                  </div>
                  <div
                     className="pet-card"
                     onClick={() => {
                        navigate('items/search?filter=물고기/기타동물')
                     }}
                  >
                     <img className="pet-img3 image" src="/images/물고기.png" alt="물고기" />
                     <p>물고기/기타동물</p>
                  </div>
               </div>
            </section>

            {/* NEW / KEYWORD / REVIEW */}
            <section id="contents-review">
               <div className="contents-card left-card">
                  <div className="card-header">
                     <div className="window-btn">
                        <span className="red"></span>
                        <span className="green"></span>
                        <span className="blue"></span>
                     </div>
                     <div className="card-header__header">
                        <span className="contents-card-title">NEW CONTENTS</span>
                        <Link to={'/contents'}>
                           보러가기
                           <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24">
                              <path fill="currentColor" d="M16 11v2h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1H9v1H8v-1H7v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-2h-1v-1h-1V9h-1V8H9V7H8V6H7V5h1V4h1v1h1v1h1v1h1v1h1v1h1v1h1v1z"></path>
                           </svg>
                        </Link>
                     </div>
                  </div>
                  <div className="new-contents-card-body">
                     <NewContentsSlider posts={posts} />
                  </div>
               </div>

               <div className="right-contents">
                  <div className="contents-card">
                     <div className="card-header">
                        <div className="window-btn">
                           <span className="red"></span>
                           <span className="green"></span>
                           <span className="blue"></span>
                        </div>
                        <span className="contents-card-title">KEYWORD</span>
                     </div>
                     <div className="keyword-card">
                        {[1, 2, 3, 4].map((num) => (
                           <div key={num} className="topic">
                              {num}
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="contents-card">
                     <div className="card-header">
                        <div className="window-btn">
                           <span className="red"></span>
                           <span className="green"></span>
                           <span className="blue"></span>
                        </div>
                        <div className="card-header__header">
                           <span className="contents-card-title">BEST REVIEW</span>
                           <Link to={'/reviews'}>
                              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24">
                                 <path fill="currentColor" d="M16 11v2h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1H9v1H8v-1H7v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-2h-1v-1h-1V9h-1V8H9V7H8V6H7V5h1V4h1v1h1v1h1v1h1v1h1v1h1v1h1v1z"></path>
                              </svg>
                           </Link>
                        </div>
                     </div>
                     <div className="review-card">
                        <ReviewSlider reviews={reviews} />
                     </div>
                  </div>
               </div>
            </section>

            {/* 댕댕이 장마대비존 */}
            <section id="rainy-dog">
               <div className="section-title">
                  <p>
                     댕댕이 장마대비존
                     <iconify-icon style={{ marginLeft: '10px' }} icon="streamline-pixel:weather-umbrella-snowing" width="32" height="32" />
                  </p>
                  <Link className="more-btn" to="/items/search?filter=강아지/장마">
                     More <iconify-icon icon="pixel:angle-right" width="13" height="13" />
                  </Link>
               </div>

               <div className="card-list" style={{ marginTop: '10px' }}>
                  {eventData.map((item) => (
                     <div key={item.id} className="card">
                        <img height="160" src={buildImg(item.ItemImages[0]?.imgUrl)} alt={`상품 ${item.itemNm}`} />
                        <div className="card-text">
                           <p>상품 {item.itemNm}</p>
                           <p>{item.price}원</p>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="banner2">배너 디자인 완료 후 업로드 예정</div>
            </section>

            {/* 2025 S/S 신상템 */}
            <section id="ss-new">
               <div className="section-title">
                  <p>
                     2025 S/S 신상템
                     <iconify-icon style={{ marginLeft: '10px' }} icon="streamline-pixel:interface-essential-crown" width="32" height="32" />
                  </p>
                  <Link className="more-btn" to="/items/sorted?sort=newItems">
                     More <iconify-icon icon="pixel:angle-right" width="13" height="13" />
                  </Link>
               </div>

               <div className="card-list" style={{ marginTop: '10px' }}>
                  {newItems.map((item) => {
                     const id = item.itemId ?? item.id
                     return (
                        <div key={id} className="card">
                           <Link to={`/items/detail/${id}`}>
                              <img height="160" src={buildImg(item.ItemImages[0].imgUrl)} alt={item.itemNm} />
                              <div className="card-text">
                                 <p>{item.itemNm}</p>
                                 <p>{item.price}원</p>
                              </div>
                           </Link>
                        </div>
                     )
                  })}
               </div>
            </section>
         </div>
      </main>
   )
}

export default MainPage

