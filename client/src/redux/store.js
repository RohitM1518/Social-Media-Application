import { configureStore } from '@reduxjs/toolkit'
import userReducer from './useSlice.js'

export default configureStore({
  reducer: {
    user: userReducer,
  },
})