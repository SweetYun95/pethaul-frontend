export const getTokenErrorMessage = (errorCode) => {
   switch (errorCode) {
      case 'expired':
         return '토큰이 만료되었습니다. 다시 발급받아주세요.'
      case 'invalid':
         return '유효하지 않은 토큰입니다. 다시 로그인해주세요.'
      case 'unknown':
         return '알 수 없는 오류가 발생했습니다.'
      default:
         return ''
   }
}
