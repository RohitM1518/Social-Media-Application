import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { AuthLayout } from './components/index.js'
import {SignUp,SignIn,Home, AllPosts, Profile} from './pages/index.js'
import { ResponseContextProvider } from './contexts/ResponseContext.jsx'
import { ErrorContextProvider } from './contexts/ErrorContext.jsx'
import { UserContextProvider } from './contexts/UserContext.jsx'
import { LoadingContextProvider } from './contexts/LoadingContext.jsx'
// import 'bootstrap/dist/css/bootstrap.min.css';



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
        path:'/',
        element: <AuthLayout authentication={false}>
            <Home />
        </AuthLayout>
      },
      {
        path:'/posts',
        element: <AuthLayout authentication={true}>
            <AllPosts />
        </AuthLayout>
      },
      {
        path:'/profile/:id',
        element: <AuthLayout authentication={true}>
            <Profile />
        </AuthLayout>
      },
    ]
  }
])



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ResponseContextProvider>
      <ErrorContextProvider>
      <UserContextProvider>
        <LoadingContextProvider>
    <RouterProvider router={router} />
    </LoadingContextProvider>
    </UserContextProvider>
    </ErrorContextProvider>
    </ResponseContextProvider>
    </Provider>
  </React.StrictMode>,
)
