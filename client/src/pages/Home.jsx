import React from 'react';
import { useSelector } from 'react-redux';
import SlideShow from '../components/SlideShow';
import Slide1 from '../assets/slide1.jpeg'
import Slide2 from '../assets/slide2.jpeg'
import Slide3 from '../assets/slide3.jpeg'
const Home = () => {
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
          <p className="mt-2 text-center">
            <a href="/signup" className="underline">Sign Up</a> or <a href="/signin" className="underline">Log In</a> to start using the platform.
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