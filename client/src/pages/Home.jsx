import React from 'react';
import { useSelector } from 'react-redux';
import SlideShow from '../components/SlideShow';
import Slide1 from '../assets/slide1.jpeg'
import Slide2 from '../assets/slide2.jpeg'
import Slide3 from '../assets/slide3.jpeg'
import { useNavigate } from 'react-router-dom';
import {Button} from '../components/Button'

const Home = () => {
  const navigate = useNavigate()
  const images = [
    Slide1,
    Slide2,
    Slide3
  ];
  const user = useSelector(state => state?.user?.currentUser)
  return (
    <div className="min-h-screen bg-white text-black font-mono w-full flex justify-center">
      <main className="p-4">
        <section className="mb-8">
          <h2 className="text-7xl text-center font-semibold">Stay in the Loop</h2>
          <p className="mt-7 text-center">
          Never miss out on the latest trends and updates from your friends and favorite influencers. 😎🤟🏻
          </p>
        </section>
       
        {!user && <section>
          <h2 className="text-2xl text-center">Get Started</h2>
          <p className="mt-2 text-center flex justify-center items-center flex-col">
            <div className=' flex justify-center items-center'>
              <div onClick={()=>{navigate('/signup')}} className="hover:cursor-pointer">
            <Button style=' hover:bg-white hover:text-black bg-black text-white lg:hover:border lg:hover:border-black'>Sign Up</Button>
            </div>
            or
            <div onClick={()=>navigate('/signin')} className="hover:cursor-pointer">
            <Button style=' bg-white text-black border border-black lg:hover:bg-black lg:hover:text-white'>Sign In</Button>
            </div>
            </div>
            <div>To start using the platform</div>
          </p>
        </section>}
        <section className="mb-8 flex justify-center gap-8 items-center">
        <SlideShow images={images}/>
        </section>
      </main>
    </div>
  );
};

export default Home;