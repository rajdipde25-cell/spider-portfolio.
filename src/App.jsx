import React from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import SpiderWebs from './components/SpiderWebs';
import OverlayEffects from './components/OverlayEffects';
import CustomCursor from './components/CustomCursor';
import RefinedSnow from './components/RefinedSnow';
import AudioManager from './components/AudioManager';

function App() {
  return (
    <>
      <AudioManager />
      <CustomCursor />
      <OverlayEffects />
      <RefinedSnow />
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Contact />
    </>
  );
}

export default App;
