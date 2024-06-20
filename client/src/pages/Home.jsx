import React from 'react';
import { useSelector } from 'react-redux';
const Home = () => {
  const user = useSelector(state => state?.user?.currentUser)
  return (
    <div className="min-h-screen bg-white text-black font-mono w-full flex justify-center">
      <main className="p-4">
        <section className="mb-8">
          <h2 className="text-5xl">Welcome to Our Social Media Platform</h2>
          <p className="mt-2 text-center">
            Connect with friends and the world around you.
          </p>
        </section>
        <section className="mb-8 flex justify-center gap-8 items-center">
          <h2 className="text-2xl">Features</h2>
          <ul className="list-disc list-inside mt-2">
            <li>User Registration and Login</li>
            <li>Create, Read, Update, and Delete Posts</li>
            <li>Like and Comment on Posts</li>
          </ul>
        </section>
        {!user && <section>
          <h2 className="text-2xl text-center">Get Started</h2>
          <p className="mt-2 text-center">
            <a href="/signup" className="underline">Sign Up</a> or <a href="/signin" className="underline">Log In</a> to start using the platform.
          </p>
        </section>}
      </main>
    </div>
  );
};

export default Home;