import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig } from 'eslint/config'

export default defineConfig([

   {
      // 전역적으로 무시할 파일 패턴 (dist 폴더 등)
      ignores: ['dist'],

      // eslint 규칙 적용 대상 파일
      files: ['**/*.{js,jsx}'],

      extends: [
         js.configs.recommended, // ESLint 기본 추천 규칙
         reactHooks.configs['recommended-latest'], // React Hooks 추천 규칙
         reactRefresh.configs.vite, // Vite 환경에서의 React 관련 규칙
      ],

      // 언어 옵션 및 파서 설정
      languageOptions: {
         ecmaVersion: 2020, // ECMAScript 최신 버전
         globals: globals.browser, // 브라우저에서 사용할 전역 변수 설정
         parserOptions: {
            ecmaVersion: 'latest', // 최신 ECMAScript 버전 사용
            ecmaFeatures: { jsx: true }, // JSX 문법을 허용
            sourceType: 'module', // ES 모듈 사용
         },
      },

      rules: {
         // 불필요한 변수 경고를 에러로 설정하고, 대문자로 시작하는 변수명은 예외 처리
         'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
         'react-hooks/rules-of-hooks': 'off', // hooks 규칙을 비활성화
      },
   },
])
