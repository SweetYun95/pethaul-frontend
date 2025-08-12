import '../css/OrderState.css'

function OrderState() {
   return <section id='order-state'>
               <div className='contents-card'>
               <div className='card-header' >
                  <div className='window-btn'>
                  <span className='red'></span>
                  <span className='green'></span>
                  <span className='blue'></span>
                  </div>
                  <span className='card-title'>주문현황</span>
               </div>
                  <div className="order-state-details">
                     <div></div>
                     <div></div>
                     <div></div>
                     <div></div>
                  </div>
               </div>
         </section>
}

export default OrderState
