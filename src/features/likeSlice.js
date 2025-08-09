import { createSlice } from '@reduxjs/toolkit'

const savedLikes = JSON.parse(localStorage.getItem('likes')) || {}

const likeSlice = createSlice({
   name: 'like',
   initialState: {
      likes: savedLikes,
   },
   reducers: {
      toggleLike: (state, action) => {
         const itemId = action.payload
         state.likes[itemId] = !state.likes[itemId]
         localStorage.setItem('likes', JSON.stringify(state.likes))
      },
   },
})

export const { toggleLike } = likeSlice.actions
export default likeSlice.reducer
