import React, { useEffect, useState } from 'react';
import './Loader.css';

const Loader = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 3000); // Start fade out
    const timer2 = setTimeout(() => {
      const loaderEl = document.getElementById('loader');
      if (loaderEl) loaderEl.style.display = 'none';
    }, 4000); // Remove after fade

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div id="loader" className={"loader ${fadeOut ? 'fade-out' : ''}"}>
      <h1 className="loader-text">RP Square</h1>
    </div>
  );
};

export default Loader;