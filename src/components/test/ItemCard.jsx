import { formatWithComma } from '../../utils/priceSet'
import { Link } from 'react-router-dom'

function ItemCard({ handleLike, item, imgSrc, liked, isSoldOut }) {
   return (
      <Link key={item.id} to={`/items/detail/${item.id}`} className="card">
         <div className="item-img like-btn">
            <img src={imgSrc} alt={item.itemNm} style={{ filter: item.itemSellStatus == 'SOLD_OUT' ? 'grayscale(100%)' : 'none' }} />
            {isSoldOut && <span className="badge badge-soldout">품절</span>}

            <button className={`like ${liked ? 'on' : ''}`} aria-label={liked ? '좋아요 취소' : '좋아요'} onClick={(e) => handleLike(e, item.id)} type="button" title={liked ? '좋아요 취소' : '좋아요'}>
               {liked ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" aria-hidden="true">
                     <path fill="#f70000" stroke="#000" strokeWidth={1} d="M23 6v5h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1H9v-1H8v-1H7v-1H6v-1H5v-1H4v-1H3v-1H2v-1H1V6h1V5h1V4h1V3h6v1h1v1h2V4h1V3h6v1h1v1h1v1z" />
                  </svg>
               ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
                     <path
                        fill="#000"
                        d="M22 6V5h-1V4h-1V3h-6v1h-1v1h-2V4h-1V3H4v1H3v1H2v1H1v5h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h2v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1V6zm-2 4v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1H9v-1H8v-1H7v-1H6v-1H5v-1H4v-1H3V7h1V6h1V5h4v1h1v1h1v1h2V7h1V6h1V5h4v1h1v1h1v3z"
                     />
                  </svg>
               )}
            </button>
         </div>

         <div className="content">
            <div className="cats">
               {(item?.Categories ?? []).map((c) => (
                  <span key={`${item.id}-${c?.id ?? c?.categoryName}`} className="cat">
                     #{c?.categoryName ?? c?.name}
                  </span>
               ))}
            </div>
            <p className="title" title={item.itemNm}>
               {item.itemNm}
            </p>
            <p className="price">
               {item.itemSellStatus == 'SOLD_OUT'
                  ? ''
                  : (() => {
                       const pretty = formatWithComma(item?.price)
                       return pretty ? `${pretty}원` : '가격 정보 없음'
                    })()}
            </p>
         </div>
      </Link>
   )
}

export default ItemCard
