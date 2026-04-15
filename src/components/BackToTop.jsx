import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { BsArrowUp } from 'react-icons/bs';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`back-to-top ${isVisible ? 'visible' : ''}`}>
      <Button
        variant="primary"
        className="rounded-circle shadow-lg p-3"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <BsArrowUp size={20} />
      </Button>
    </div>
  );
};

export default BackToTop;
