import React from 'react'
import './css/Main.css'
function MainPage() {
   const products = [1, 2, 3]
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
               <img className="img1" src="../../public/images/복냥이.png" alt="bannerimg" />
               <img className="img2" src="../../public/images/7.png" alt="bannerimg" />
               <img className="img3" src="../../public/images/3.png" alt="bannerimg" />
               <img className="img4" src="../../public/images/5.png" alt="bannerimg" />
               <img className="img5" src="../../public/images/6.png" alt="bannerimg" />
               <img className="img6" src="../../public/images/발바닥.png" alt="bannerimg" />
               <img className="img7" src="../../public/images/발바닥.png" alt="bannerimg" />
               <img className="img8" src="../../public/images/수박냥이.png" alt="bannerimg" />
               <img className="img9" src="../../public/images/어항냥이.png" alt="bannerimg" />
               <img className="img10" src="../../public/images/빙냥이.png" alt="bannerimg" />
               <div className="click">
                  <img className="click-img" src="../../public/images/발.png" alt="bannerimg" />
                  <p className="click-text">click!</p>
               </div>
            </section>
            {/* 상품 섹션 */}
            <section id="best-products">
               <div className="section-title">
                  <p>
                     오늘의 BEST HAUL<iconify-icon style={{ marginLeft: '10px' }} icon="streamline-pixel:entertainment-events-hobbies-reward-winner-talent" width="32" height="32"></iconify-icon>
                  </p>
                  <button className="more-btn">
                     More <iconify-icon icon="pixel:angle-right" width="13" height="13"></iconify-icon>{' '}
                  </button>
               </div>
               <div className="card-list" style={{ marginTop: '10px' }}>
                  {[1, 2, 3, 4, 5].map((num) => (
                     <div key={num} className="card">
                        <img height="160" src={`/images/sample${num}.jpg`} alt={`상품 ${num}`} />
                        <div className="card-text">
                           <p>상품 {num}</p>
                           <p>₩가격</p>
                        </div>
                     </div>
                  ))}
               </div>
            </section>
            {/* 너에 대해 알려줄래? 종류를 선택해 주세요 ! (반려동물 이미지출력) */}
            <section id="pet-selector">
               <h1>너에 대해 알려줄래? </h1>
               <p>종류를 선택해 주세요!</p>
               <div className="pet-list">
                  <div className="pet-card">
                     <img className="pet-img1 image" src="../../public/images/강아지.png" alt="강아지" />
                     <p>강아지</p>
                  </div>
                  <div className="pet-card">
                     <img className="pet-img2 image" src="../../public/images/햄스터.png" alt="햄스터" />
                     <p>햄스터</p>
                  </div>
                  <div className="pet-card">
                     <img className="pet-img3 image" src="../../public/images/고슴도치.png" alt="고슴도치" />
                     <p>고슴도치</p>
                  </div>
                  <div className="pet-card">
                     <img className="pet-img3 image" src="../../public/images/새.png" alt="새" />
                     <p>새(앵무새)</p>
                  </div>
                  <div className="pet-card">
                     <img className="pet-img3 image" src="../../public/images/고양이.png" alt="고양이" />
                     <p>고양이</p>
                  </div>
                  <div className="pet-card">
                     <img className="pet-img3 image" src="../../public/images/토끼.png" alt="토끼" />
                     <p>토끼</p>
                  </div>
                  <div className="pet-card">
                     <img className="pet-img3 image" src="../../public/images/물고기.png" alt="물고기" />
                     <p>물고기/기타동물</p>
                  </div>
               </div>
            </section>
            {/* NEW CONTENTS, BEST REVIEW,KEYWORD */}
            <section id="contents-review">
               <div className="contents-card large">
                  <div className="card-header">
                     <div className="window-btn">
                        <span className="red"></span>
                        <span className="green"></span>
                        <span className="blue"></span>
                     </div>
                     <span className="contents-card-title">NEW CONTENTS</span>
                  </div>
                  <div className="card-body">콘텐츠 1</div>
                  <div className="card-footer">
                     <a href="#">
                        NEW CONTENT <br />
                        보러가기
                     </a>
                  </div>
               </div>
               <div className="right-contents">
                  <div className="contents-card small">
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
                  <div className="contents-card small">
                     <div className="card-header">
                        <div className="window-btn">
                           <span className="red"></span>
                           <span className="green"></span>
                           <span className="blue"></span>
                        </div>
                        <span className="contents-card-title">BEST REVIEW</span>
                     </div>
                     <div className="review-card">리뷰 1</div>
                  </div>
               </div>
            </section>
            {/* 댕댕이 장마대비존 */}
            <section id="rainy-dog">
               <div className="section-title">
                  <p>
                     댕댕이 장마대비존<iconify-icon style={{ marginLeft: '10px' }} icon="streamline-pixel:weather-umbrella-snowing" width="32" height="32"></iconify-icon>
                  </p>
                  <button className="more-btn">
                     More <iconify-icon icon="pixel:angle-right" width="13" height="13"></iconify-icon>{' '}
                  </button>
               </div>
               <div className="card-list" style={{ marginTop: '10px' }}>
                  {[1, 2, 3, 4, 5].map((num) => (
                     <div key={num} className="card">
                        <img height="160" src={`/images/sample${num}.jpg`} alt={`상품 ${num}`} />
                        <div className="card-text">
                           <p>상품 {num}</p>
                           <p>₩가격</p>
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
                     2025 S/S 신상템<iconify-icon style={{ marginLeft: '10px' }} icon="streamline-pixel:interface-essential-crown" width="32" height="32"></iconify-icon>
                  </p>
                  <button className="more-btn">
                     More <iconify-icon icon="pixel:angle-right" width="13" height="13"></iconify-icon>{' '}
                  </button>
               </div>
               <div className="card-list" style={{ marginTop: '10px' }}>
                  {[1, 2, 3, 4, 5].map((num) => (
                     <div key={num} className="card">
                        <img height="160" src={`/images/sample${num}.jpg`} alt={`상품 ${num}`} />
                        <div className="card-text">
                           <p>상품 {num}</p>
                           <p>₩가격</p>
                        </div>
                     </div>
                  ))}
               </div>
            </section>
         </div>
      </main>
   )
}
export default MainPage
