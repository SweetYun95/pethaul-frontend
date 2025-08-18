// src/components/item/ItemFormBase.jsx
import { Box } from '@mui/material'
import '../css/item/ItemFormBase.css' // 등록 폼 CSS 그대로 사용
import { useEffect, useMemo, useRef, useState } from 'react'
import { formatWithComma, stripComma } from '../../utils/priceSet'


// initialData 유연 정규화
function normalize(raw) {
  if (!raw) return null
  return {
    id: raw.id ?? raw.itemId ?? null,
    itemNm: raw.itemNm ?? raw.name ?? raw.itemName ?? '',
    price: raw.price ?? raw.amount ?? raw.itemPrice ?? '',
    stockNumber: raw.stockNumber ?? raw.stock ?? raw.quantity ?? '',
    itemSellStatus: raw.itemSellStatus ?? raw.status ?? 'SELL',
    itemDetail: raw.itemDetail ?? raw.description ?? '',
    itemSummary: raw.itemSummary ?? raw.summary ?? '',
    ItemImages: raw.ItemImages ?? raw.images ?? raw.photos ?? [],
    Categories: (raw.Categories ?? raw.categories ?? []).map((c) =>
      typeof c === 'string'
        ? { categoryName: c }
        : { categoryName: c?.categoryName ?? c?.name ?? '' }
    ),
  }
}

const toAbs = (base, url) => {
  if (!url) return ''
  const u = String(url).trim()
  if (/^https?:\/\//i.test(u)) return u
  const left = (base || '').replace(/\/+$/,'')
  const right = u.replace(/^\/+/,'')
  return `${left}/${right}`
}

export default function ItemFormBase({
  mode = 'create',          // 넘어오든 말든 initialData 있으면 edit로 바꿈
  initialData = null,
  onSubmit,
}) {
  const apiBase = import.meta.env.VITE_APP_API_URL

  // ✅ initialData가 있으면 무조건 edit처럼 동작
  const formMode = initialData ? 'edit' : String(mode || 'create').trim().toLowerCase()
  const finalSubmitLabel = formMode === 'edit' ? '수정하기' : '등록하기'

  if (formMode === 'edit' && !initialData) return null

  // 정규화 + 메모
  const norm = useMemo(
    () => (formMode === 'edit' && initialData ? normalize(initialData) : null),
    [formMode, initialData]
  )

  const initialServerImgUrls = useMemo(() => {
    if (!norm) return []
    return (norm.ItemImages || [])
      .map((img) => (typeof img === 'string' ? img : img?.imgUrl))
      .filter(Boolean)
      .map((u) => toAbs(apiBase, u))
  }, [norm, apiBase])

  const initialCategoryInput = useMemo(() => {
    if (!norm) return ''
    const names = (norm.Categories || []).map((c) => c.categoryName).filter(Boolean)
    return names.length ? names.map((n) => `#${n}`).join(' ') : ''
  }, [norm])

  // 상태 (초기부터 norm 기반)
  const [imgUrls, setImgUrls] = useState(initialServerImgUrls)
  const [imgFiles, setImgFiles] = useState([])
  const [imgError, setImgError] = useState("")
  const [itemNm, setItemNm] = useState(norm?.itemNm ?? '')
  const [price, setPrice] = useState(String(norm?.price ?? ''))
  const [stockNumber, setStockNumber] = useState(String(norm?.stockNumber ?? ''))
  const [itemSellStatus, setItemSellStatus] = useState(norm?.itemSellStatus ?? 'SELL')
  const [itemDetail, setItemDetail] = useState(norm?.itemDetail ?? '')
  const [itemSummary, setItemSummary] = useState(norm?.itemSummary ?? '')
  const [inputCategory, setInputCategory] = useState(initialCategoryInput)

  // initialData 변경 시 동기화
  useEffect(() => {
    if (formMode !== 'edit' || !norm) return
    setImgUrls(initialServerImgUrls)
    setImgFiles([])
    setItemNm(norm.itemNm ?? '')
    setPrice(String(norm.price ?? ''))
    setStockNumber(String(norm.stockNumber ?? ''))
    setItemSellStatus(norm.itemSellStatus ?? 'SELL')
    setItemDetail(norm.itemDetail ?? '')
    setItemSummary(norm.itemSummary ?? '')
    setInputCategory(initialCategoryInput)
  }, [formMode, norm, initialServerImgUrls, initialCategoryInput])

  // objectURL 정리
  const prevUrlsRef = useRef([])
  useEffect(() => () => prevUrlsRef.current.forEach((u) => URL.revokeObjectURL(u)), [])

  // 숫자 처리
  const handleNumeric = (raw) => {
    const numeric = stripComma(raw)
    if (!/^\d*$/.test(numeric)) return null
    return numeric
  }

  // 기존 handleImageChange 교체
const handleImageChange = (e) => {
  setImgError("");
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  const MAX = 5;
  const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];

  // 형식 필터
  const valid = files.filter((f) => ALLOWED.includes(f.type));
  if (valid.length !== files.length) {
    setImgError("이미지 파일만 업로드할 수 있어요 (jpg/png/webp/gif).");
  }

  // 중복 방지(같은 파일 다시 고른 경우 제외)
  const key = (f) => `${f.name}_${f.size}_${f.lastModified}`;
  const existingKeys = new Set(imgFiles.map(key));
  const unique = valid.filter((f) => !existingKeys.has(key(f)));

  // 남은 슬롯: 현재 미리보기 개수(imgUrls: 서버+로컬URL 포함)를 기준으로 계산
  const remain = MAX - imgUrls.length;
  if (remain <= 0) {
    setImgError(`최대 ${MAX}장까지 업로드할 수 있어요.`);
    e.target.value = ""; // 동일 파일 다시 선택 가능하도록 리셋
    return;
  }

  const toAdd = unique.slice(0, remain);

  // 새 objectURL 생성 (서버 URL은 건들지 않음)
  const newUrls = toAdd.map((f) => {
    const u = URL.createObjectURL(f);
    prevUrlsRef.current.push(u);
    return u;
  });

  // 상태 누적
  setImgFiles((prev) => [...prev, ...toAdd]);
  setImgUrls((prev) => [...prev, ...newUrls]);

  // 같은 파일 다시 선택 가능하도록
  e.target.value = "";
};

  const handlePriceChange = (e) => {
    const n = handleNumeric(e.target.value)
    if (n === null) return
    setPrice(n)
  }

  const handleStockChange = (e) => {
    const n = handleNumeric(e.target.value)
    if (n === null) return
    setStockNumber(n)
  }

  // payload
  const buildFormData = () => {
    const fd = new FormData()
    // ✅ edit일 때 id도 같이 보냄(백엔드가 기대하는 경우 대비)
    if (formMode === 'edit' && norm?.id != null) fd.append('id', String(norm.id))

    fd.append('itemNm', itemNm)
    fd.append('price', String(price))
    fd.append('stockNumber', String(stockNumber))
    fd.append('itemSellStatus', itemSellStatus)
    fd.append('itemDetail', itemDetail)
    fd.append('itemSummary', itemSummary)

    if (imgFiles?.length) {
      imgFiles.forEach((file) => {
        const encoded = new File([file], encodeURIComponent(file.name), { type: file.type })
        fd.append('img', encoded) // 서버가 배열을 기대하면 'img[]'
      })
    }
    const categories = inputCategory.split('#').map((c) => c.trim()).filter(Boolean)
    fd.append('categories', JSON.stringify(categories))
    return fd
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  console.log('[ItemFormBase] submit start', { formMode, itemNm, price, stockNumber })

  if (typeof onSubmit !== 'function') {
    console.error('[ItemFormBase] onSubmit is not provided!')
    alert('수정 핸들러(onSubmit)가 연결되지 않았습니다. ItemEditForm에서 onSubmit prop을 넘겨주세요.')
    return
  }

  try {
    if (!itemNm.trim()) return alert('상품명을 입력하세요!')
    if (!String(price).trim()) return alert('가격을 입력하세요!')
    if (!String(stockNumber).trim()) return alert('재고를 입력하세요.')
    if (formMode === 'create' && (!imgFiles || imgFiles.length === 0)) {
      return alert('이미지는 최소 1개 이상 업로드 하세요.')
    }

    const fd = buildFormData()
    await onSubmit(fd)       // ✅ optional chaining 제거!
    console.log('[ItemFormBase] submit done')
  } catch (err) {
    console.error('[ItemFormBase] submit failed', err)
    alert(err?.message || '수정 중 오류가 발생했습니다.')
  }
}
  return (
    <section id="itemCreate-section">
      <h1 className="section-title">{formMode === 'edit' ? '상품 수정' : '상품 등록'}</h1>
      <div className="contents-card">
        <div className="card-header">
          <div className="window-btn">
            <span className="red"></span>
            <span className="green"></span>
            <span className="blue"></span>
          </div>
          <span className="card-title">상품정보를 입력해주세요.</span>
        </div>

        <div className="item-create-form-group">
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <label className="img-up-btn">
              이미지 업로드 (최대 5개)
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 32 32">
                <path fill="#000" d="M27.425 6.09h-1.52V4.57h-1.52V3.04h-1.53V1.52h-1.52V0H3.045v32h25.91V7.62h-1.53Zm0 24.38H4.575V1.52h15.23v7.62h7.62Z"/>
                <path fill="#000" d="M19.805 19.81v-1.53h-1.52v1.53h-9.14v-1.53h-1.53V7.62h-1.52v16.76h1.52v-3.05h16.77v3.05h1.52V10.66h-1.52v7.62h-1.53v1.53z"/>
                <path fill="#000" d="M7.615 24.38h16.77v1.52H7.615Zm13.72-7.62h1.52v1.52h-1.52Zm-3.05-1.52h3.05v1.52h-3.05Zm-1.52 1.52h1.52v1.52h-1.52Zm-1.53-1.52h1.53v1.52h-1.53Zm-3.04-1.53h3.04v1.53h-3.04Zm-1.53 1.53h1.53v1.52h-1.53Zm-1.52 1.52h1.52v1.52h-1.52Zm0-7.62h3.05v3.05h-3.05Zm-1.53-3.05h9.15v1.53h-9.15Z"/>
              </svg>
              <input type="file" name="img" accept="image/*" hidden multiple onChange={handleImageChange}/>
            </label>

            <Box display="flex" flexWrap="wrap" gap={2} mt={2} sx={{ justifyContent: 'flex-start' }}>
                {imgUrls.map((url, index) => (
              <Box key={url} sx={{ width: '120px', height: '120px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={url} alt={`업로드 이미지 ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
               ))}
             </Box>
            <div style={{marginTop: 8}}>
                <small>{imgUrls.length}/5</small>
                {imgError && <small style={{color:'#d00', marginLeft: 8}}>{imgError}</small>}
             </div>

            <div className="input-group">
              <div className="item-input-section item-name">
                <p>상품명</p>
                <input value={itemNm} onChange={(e) => setItemNm(e.target.value)} placeholder="상품명을 입력해주세요." maxLength={15}/>
              </div>

              <div className="item-input-section item-price">
                <p>가격</p>
                <input inputMode="numeric" value={formatWithComma(price)} onChange={handlePriceChange} placeholder="가격을 입력해주세요." maxLength={10}/>
              </div>

              <div className="item-input-section item-amount">
                <p>재고/수량</p>
                <input inputMode="numeric" value={stockNumber} onChange={handleStockChange} placeholder="수량을 입력해주세요." maxLength={10}/>
              </div>

              <div className="item-input-section item-category">
                <p>상품 카테고리</p>
                <input placeholder="예) #식품#장난감#여름나기" value={inputCategory} onChange={(e) => setInputCategory(e.target.value)}/>
              </div>

              <div className="item-input-section">
                <label htmlFor="item-sell-status" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>판매 상태</label>
                <select id="item-sell-status" value={itemSellStatus} onChange={(e) => setItemSellStatus(e.target.value)}>
                  <option value="SELL">판매중</option>
                  <option value="SOLD_OUT">품절</option>
                </select>
              </div>
            </div>

            {/* 요약 */}
            <div className="item-input-section">
              <p>상품 요약 (500자 미만)</p>
              <textarea className="item-create-input item-summary" placeholder="상품 요약 (500자 미만)" value={itemSummary} onChange={(e) => setItemSummary(e.target.value)}/>
            </div>

            {/* 상세 설명 */}
            <div className="item-input-section">
              <p>상품 설명</p>
              <textarea className="item-create-input item-detail" placeholder="상품설명을 작성해주세요." value={itemDetail} onChange={(e) => setItemDetail(e.target.value)}/>
            </div>

            {/* 버튼: 모드에 맞게 라벨 */}
            <button
              className="submit-btn"
              type="submit"
              onClick={() => console.log('[ItemFormBase] submit button clicked')}
              style={{ pointerEvents: 'auto' }} // 혹시 상위 레이어가 막고 있을 때 대비
            >
              {finalSubmitLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
