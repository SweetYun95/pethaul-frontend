import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import eslintPlugin from 'vite-plugin-eslint' // ESLint 플러그인 추가

// https://vite.dev/config/
export default defineConfig({
   plugins: [
      react(),
      eslintPlugin(), // ESLint 플러그인 추가
   ],
})
