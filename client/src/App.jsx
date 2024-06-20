import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {

  return (
    <div className=''>
    
    <Header />
    
    <div className='w-full h-36'>
    </div>
  
    <Outlet />
    
    <Footer />
    </div>
  )
}

export default App
