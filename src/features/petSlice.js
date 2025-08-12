import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUserPets, createPet, updatePet, deletePet } from '../api/petApi'

// 펫 등록
export const createPetThunk = createAsyncThunk('pet/create', async (formData, { rejectWithValue }) => {
   try {
      const res = await createPet(formData)
      return res.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 펫 수정
export const updatePetThunk = createAsyncThunk('pet/update', async ({ id, formData }, { rejectWithValue }) => {
   try {
      const res = await updatePet(id, formData)
      return res.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 유저의 펫 목록 조회
export const getUserPetsThunk = createAsyncThunk('pet/getUserPets', async (userId, { rejectWithValue }) => {
   try {
      const res = await getUserPets(userId)
      return res.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 펫 삭제
export const deletePetThunk = createAsyncThunk('pet/delete', async (id, { rejectWithValue }) => {
   try {
      await deletePet(id)
      return id
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

export const petSlice = createSlice({
   name: 'pet',
   initialState: {
      pet: null, // 단일 펫
      pets: [], // 펫 목록
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 펫 등록
         .addCase(createPetThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createPetThunk.fulfilled, (state, action) => {
            state.loading = false
            // 응답 가정: { success, message, pet }
            state.pet = action.payload.pet
            if (action.payload.pet) state.pets.push(action.payload.pet)
         })
         .addCase(createPetThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 펫 수정
         .addCase(updatePetThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updatePetThunk.fulfilled, (state, action) => {
            state.loading = false
            // 응답 가정: { success, message, pet }
            const updated = action.payload.pet
            if (updated) {
               state.pet = updated
               const idx = state.pets.findIndex((p) => p.id === updated.id)
               if (idx !== -1) state.pets[idx] = updated
            }
         })
         .addCase(updatePetThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 유저 펫 목록
         .addCase(getUserPetsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getUserPetsThunk.fulfilled, (state, action) => {
            state.loading = false
            // 응답 가정: { success, message, pets }
            state.pets = action.payload.pets || []
         })
         .addCase(getUserPetsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 펫 삭제
         .addCase(deletePetThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deletePetThunk.fulfilled, (state, action) => {
            state.loading = false
            const deletedId = action.payload
            state.pets = state.pets.filter((p) => p.id !== deletedId)
            if (state.pet?.id === deletedId) state.pet = null
         })
         .addCase(deletePetThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default petSlice.reducer
