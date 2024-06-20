import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import  {UserContextProvider}  from './contexts/userContext'
function App() {

  return (
      <UserContextProvider>
    <div className=''>
        <Header />
        <div className='w-full h-36'>
        </div>
        <div className=' container h-screen items-center'>
          <Outlet />
        </div>
        <Footer />

    </div>
      </UserContextProvider>
  )
}

export default App
