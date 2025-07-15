import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import CTASection from '../components/Home/CTASection';
import Footer from '../components/Footer/Footer';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <CTASection />
      <Footer />
    </>
  );
};

export default HomePage; 