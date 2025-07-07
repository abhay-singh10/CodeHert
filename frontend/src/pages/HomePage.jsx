import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import Stats from '../components/Home/Stats';
import CTASection from '../components/Home/CTASection';
import Footer from '../components/Footer/Footer';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <CTASection />
      <Footer />
    </>
  );
};

export default HomePage; 