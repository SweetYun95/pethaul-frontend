# 🛍️ Pethaul Frontend

이 프로젝트는 React 기반 이커머스 프론트엔드입니다.  
팀원들이 각자의 기능을 브랜치에서 개발한 뒤, `develop` 브랜치로 병합하여 협업합니다.

---

## 📁 레포 구조

-  `/public` — HTML 템플릿, 파비콘 등 정적 파일
-  `/src` — 메인 소스 디렉토리
   -  `/api` — Axios 요청 로직
      -  `authApi.js`, `orderApi.js`, `tokenApi.js`
   -  `/components` — 재사용 가능한 UI 컴포넌트
      -  `Button.jsx`, `Navbar.jsx`, `ProductCard.jsx`
   -  `/components/chat` — 실시간 채팅 관련 컴포넌트
   -  `/components/chart` — 주문 통계, 차트 컴포넌트
   -  `/components/shared` — 공통 UI 요소 (Header, Footer 등)
   -  `/features` — Redux Toolkit 슬라이스 모음
      -  `authSlice.js`, `orderSlice.js`, `tokenSlice.js`
   -  `/pages` — 라우팅 페이지
      -  `LoginPage.jsx`, `ProductPage.jsx`, `ChatPage.jsx`, `ChartPage.jsx`
   -  `/store` — Redux store 설정
   -  `/styles` — Tailwind 설정 또는 스타일 파일
   -  `App.jsx` — 전체 라우팅 및 구조 설정
   -  `main.jsx` — React 앱 진입점
-  `.env` — 환경 변수 (API 주소 등)
-  `vite.config.js` — Vite 빌드 설정

---

## 📂 기본 폴더 및 파일 구조

pethaul-frontend/

-  ├── public/ # 정적 리소스 (index.html, 파비콘 등)
-  └── src/
-  ├── api/ # Axios API 요청 함수 모음
-  ├── components/ # UI 컴포넌트
-  │ ├── auth/ # 로그인, 회원가입 컴포넌트
-  │ ├── shared/ # 공통 컴포넌트 (헤더, 푸터 등)
-  │ ├── item/ # 상품 관련 컴포넌트
-  │ └── my/ # 마이페이지 관련 컴포넌트
-  ├── features/ # Redux slice 파일들
-  ├── pages/ # 라우트 페이지 컴포넌트
-  ├── store/ # Redux 스토어 설정
-  ├── styles/ # 전역 스타일 및 Tailwind 설정
-  ├── utils/ # 공통 유틸 함수
-  ├── App.jsx # 앱 메인 컴포넌트
-  └── main.jsx # React 앱 진입점

---

## 📦 Import 순서 가이드

> 코드 작성 시, 다음과 같은 순서로 import 문을 정렬해주세요. 각 그룹 사이에는 한 줄 공백을 추가합니다.

1. 외부 라이브러리

-  React, React Router, MUI(Material UI), Redux 등
-  예시:

```jsx
import { Box, Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
```

2. 내부 유틸 / 전역 설정 / API 모듈

-  utils, hooks, context, api 등
-  예시:

```jsx
import { fetchPost } from '@/api/postApi'
import useAuth from '@/hooks/useAuth'
```

3. 컴포넌트

-  직접 만든 컴포넌트들 (공통 또는 특정 도메인 컴포넌트 포함)
-  예시:

```jsx
import Navbar from '../components/shared/Navbar'
import PostList from '../components/post/PostList'
```

4. 스타일 파일

-  css, scss, tailwind 등
-  예시:

```jsx
import '@/styles/common.css'
```

---

## 👥 브랜치 전략

-  `main`: 배포용
-  `develop`: 통합 개발 브랜치
-  `hcm` : 한창민
-  `jsy` : 정세연
-  `jse` : 정송이
-  `ysy` : 윤승영

> 모든 기능 개발은 **각자 이름 브랜치에서 진행 후, `develop`으로 Pull Request**를 생성하여 병합합니다.

---

## 🔀 브랜치 작업 및 Push 방법

### 1. 브랜치 최초 이동

```bash
git checkout -t origin/브랜치이름

# 예
git checkout -t origin/hcm

# 이후 작업할 때는
git checkout 브랜치이름

# 최초 Push 연결
git push --set-upstream origin 브랜치이름

# 이후부터는 그냥 git push 만 해도 됩니다.

---

## 🌿 신규 브랜치 생성 규칙

기능이 세분화되거나 테스트/임시 작업이 필요한 경우, 아래 규칙에 따라 **개별 브랜치에서 파생 브랜치**를 생성할 수 있습니다.

### ✅ 브랜치 네이밍 규칙

[이니셜]-[작업유형]-[기능이름]
예시:
- `jsy-feat-popup` → 정세연 님이 팝업 기능 개발
- `hcm-fix-login-bug` → 한창민 님이 로그인 버그 수정
- `jse-test-api-token` → 정송이 님이 토큰 API 테스트


### ✅ 브랜치 생성 명령어

```bash
git checkout -b 본인지명-작업유형-기능명
git push -u origin 본인지명-작업유형-기능명
예:
git checkout -b jsy-feat-chat-ui
git push -u origin jsy-feat-chat-ui
```
> ❗ 브랜치를 새로 생성할 때는 팀 리더와 간단히 공유 후 작업해주세요.
> 작업 완료 후에는 develop 브랜치 기준으로 Pull Request를 생성합니다.

✅ 브랜치 전략은 협업의 중심입니다.
원활한 관리와 통합을 위해 가이드에 따라 작업해주세요 🙌

---

## ✍️ Git 커밋 메시지 작성 규칙
```

커밋 메시지는 형식과 내용을 명확하게 작성해야 협업 시 변경 내역을 빠르게 파악할 수 있습니다.  
아래 형식을 따라 작성해주세요:

### ✅ 기본 형식

git commit -m "[태그] 작업한 내용 요약"

예:
git commit -m "[feat] 로그인 API 구현"
git commit -m "[fix] 장바구니 오류 수정"
git commit -m "[style] 버튼 정렬 개선"

---

### ✅ 커밋 태그 종류

| 태그       | 설명                                        |
| ---------- | ------------------------------------------- |
| `feat`     | 새로운 기능 추가                            |
| `patch`    | 간단한 수정 (줄바꿈, 줄추가, 정렬 등)       |
| `fix`      | 버그 수정                                   |
| `refactor` | 코드 리팩토링 (기능 변화 없음)              |
| `style`    | 스타일, 포맷팅, 주석 등 UI 외 변경          |
| `docs`     | 문서 (README 등) 변경                       |
| `test`     | 테스트 코드 추가/수정                       |
| `chore`    | 빌드, 패키지 매니저, 설정 파일 등 기타 작업 |
| `remove`   | 불필요한 코드/파일 제거                     |

---

### ✅ 커밋 메시지 팁

-  커밋 메시지는 **한 줄 요약**, 50자 이내 권장
-  작업 내용을 명확히 드러내는 동사를 사용
-  PR 리뷰자가 한눈에 파악할 수 있도록 작성

---

### 💬 예시

[feat] 상품 상세 페이지 레이아웃 구현
[fix] 로그인 실패 시 에러 메시지 표시
[refactor] useEffect 로직 정리
[style] ChartPage 컴포넌트 마진 조정
[test] orderSlice 테스트 코드 작성
[chore] ESLint 룰 추가 및 적용
[docs] README.md에 커밋 규칙 추가
