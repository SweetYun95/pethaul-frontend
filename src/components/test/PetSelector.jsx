import { useNavigate } from 'react-router-dom'

function PetSelector() {
   const navigate = useNavigate()

   const handleClick = (sellCategory) => {
      navigate(`/item/${sellCategory}`)
   }
   return (
      <section id="pet-selector">
         <h1>너에 대해 알려줄래? </h1>
         <p>종류를 선택해 주세요!</p>
         <div className="pet-list">
            <div className="pet-card" onClick={() => handleClick('강아지')}>
               <img className="pet-img1 image" src="../../public/images/강아지.png" alt="강아지" />
               <p>강아지</p>
            </div>
            <div className="pet-card" onClick={() => handleClick('햄스터')}>
               <img className="pet-img2 image" src="../../public/images/햄스터.png" alt="햄스터" />
               <p>햄스터</p>
            </div>
            <div className="pet-card" onClick={() => handleClick('고슴도치')}>
               <img className="pet-img3 image" src="../../public/images/고슴도치.png" alt="고슴도치" />
               <p>고슴도치</p>
            </div>
            <div className="pet-card" onClick={() => handleClick('새')}>
               <img className="pet-img3 image" src="../../public/images/새.png" alt="새" />
               <p>새(앵무새)</p>
            </div>
            <div className="pet-card" onClick={() => handleClick('고양이')}>
               <img className="pet-img3 image" src="../../public/images/고양이.png" alt="고양이" />
               <p>고양이</p>
            </div>
            <div className="pet-card" onClick={() => handleClick('토끼')}>
               <img className="pet-img3 image" src="../../public/images/토끼.png" alt="토끼" />
               <p>토끼</p>
            </div>
            <div className="pet-card" onClick={() => handleClick('물고기/기타동물')}>
               <img className="pet-img3 image" src="../../public/images/물고기.png" alt="물고기" />
               <p>물고기/기타동물</p>
            </div>
         </div>
      </section>
   )
}

export default PetSelector
