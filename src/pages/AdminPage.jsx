import { useState } from 'react'
import ItemPanel from '../components/admin/ItemPanel'
import OrderPanel from '../components/admin/OrderPanel'
import ChartPanel from '../components/admin/ChartPanel'
import ContentPanel from '../components/admin/ContentPanel'
import './css/AdminPage.css' 

function AdminPage() {
   const [activeTab, setActiveTab] = useState(0)

   const renderPanel = () => {
      switch (activeTab) {
         case 0:
            return <OrderPanel />
         case 1:
            return <ItemPanel />
         case 2:
            return <ChartPanel />
         case 3:
            return <ContentPanel />
         default:
            return null
      }
   }

   return (
      <div className='dot-background'>
      <section id="admin-section">
         <h1 className='section-title admin-title'>ADMIN SECTION</h1>
         {/* 탭 버튼 */}
         <div className="tab-buttons">
            <button 
               className={activeTab === 0 ? "active" : ""} 
               onClick={() => setActiveTab(0)}
            >
               주문 관리
            </button>
            <button 
               className={activeTab === 1 ? "active" : ""} 
               onClick={() => setActiveTab(1)}
            >
               상품 관리
            </button>
            <button 
               className={activeTab === 2 ? "active" : ""} 
               onClick={() => setActiveTab(2)}
            >
               매출 차트
            </button>
            <button 
               className={activeTab === 2 ? "active" : ""} 
               onClick={() => setActiveTab(3)}
            >
               컨텐츠 등록
            </button>
         </div>

         {/* 패널 */}
         <div className="tab-content">
            {renderPanel()}
         </div>
      </section>
   </div>
   )
}

export default AdminPage
