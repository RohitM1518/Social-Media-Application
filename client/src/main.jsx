import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { AuthLayout } from './components/index.js'
import {SignUp,SignIn,Home} from './pages/index.js'


const router = createBrowserRouter([
  {
    path:'/',
    element: <App />,
    children:[
      {
        path:'/signin',
        element: <AuthLayout authentication={false}>
            <SignIn />
        </AuthLayout>
      },
      {
        path:'/signup',
        element: <AuthLayout authentication={false}>
            <SignUp />
        </AuthLayout>
      },
      {
        path:'/signup',
        element: <AuthLayout authentication={false}>
            <Home />
        </AuthLayout>
      },
    ]
  }
])



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
