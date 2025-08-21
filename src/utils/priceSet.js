// 가격 콤마 추가
export const formatWithComma = (value) => {
   if (value == null || value === '') return '' // null, undefined, 빈문자열 방어

   const str = String(value) // 무조건 문자열로 변환
   return Number(str.replace(/,/g, '')).toLocaleString('ko-KR')
}

// 가격 콤마 제거
export const stripComma = (value) => {
   return value.replace(/,/g, '') // 콤마 제거
}
