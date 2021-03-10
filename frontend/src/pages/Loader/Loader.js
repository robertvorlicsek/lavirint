import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import './Loader.css';

const pathVariants = {
  initial: {
    opacity: 0,
    pathLength: 0,
    fill: 'rgba(255,255,255,0)',
  },
  animate1: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 0.8,
      fill: {
        duration: 0.9,
        delay: 1.5,
      },
    },
  },
  animate2: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 0.9,
      fill: {
        duration: 0.9,
        delay: 1.5,
      },
    },
  },
  animate3: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 1,

      fill: {
        duration: 0.9,
        delay: 1.6,
      },
    },
  },
  animate4: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 1.1,
      fill: {
        duration: 0.9,
        delay: 1.7,
      },
    },
  },
  animate5: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 1.2,
      fill: {
        duration: 0.9,
        delay: 1.8,
      },
    },
  },
  animate6: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 1.3,
      fill: {
        duration: 0.9,
        delay: 1.9,
      },
    },
  },
  animate7: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 1.4,
      fill: {
        duration: 0.9,
        delay: 2,
      },
    },
  },
  animate8: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 1.5,
      fill: {
        duration: 0.9,
        delay: 2.1,
      },
    },
  },
  animate9: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 1.6,
      fill: {
        duration: 0.9,
        delay: 2.2,
      },
    },
  },
  animate10: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 1.7,
      fill: {
        duration: 0.9,
        delay: 2.3,
      },
    },
  },
  animate11: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 1.8,
      fill: {
        duration: 0.9,
        delay: 2.4,
      },
    },
  },
  animate12: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 1.9,
      fill: {
        duration: 0.9,
        delay: 2.5,
      },
    },
  },
  animate13: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 2,

      fill: {
        duration: 0.9,
        delay: 2.6,
      },
    },
  },
  animate14: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 2.1,
      fill: {
        duration: 0.9,
        delay: 2.7,
      },
    },
  },
  animate15: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 2.2,
      fill: {
        duration: 0.9,
        delay: 2.8,
      },
    },
  },
  animate16: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 2.3,
      fill: {
        duration: 0.9,
        delay: 2.9,
      },
    },
  },
  animate17: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 2.4,
      fill: {
        duration: 0.9,
        delay: 3,
      },
    },
  },
  animate18: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 2.5,
      fill: {
        duration: 0.9,
        delay: 3.1,
      },
    },
  },
  animate19: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 2.6,
      fill: {
        duration: 0.9,
        delay: 3.2,
      },
    },
  },
  animate20: {
    opacity: 1,
    pathLength: 1,
    fill: 'rgba(255,255,255,1)',
    transition: {
      duration: 0.9,
      ease: 'easeInOut',
      delay: 2.7,
      fill: {
        duration: 0.9,
        delay: 3.3,
      },
    },
  },
};

const Loader = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    window.addEventListener('scroll', e => setScrollTop(e.target.scrollTop), {
      capture: true,
    });
    scrollTop > 5 ? setOpacity(0) : setOpacity(1);
    return () => {
      window.removeEventListener(
        'scroll',
        e => setScrollTop(e.target.scrollTop),
        { capture: true }
      );
    };
  }, [scrollTop]);
  return (
    <div className='animated-logo-container' style={{ opacity }}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 16.6 18.9'
        className='animated-logo-element A1'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate4'
          d='M6.76,0c3.32,5,6.74,10.19,9.84,15.16C11.09,16.42,5.54,17.66,0,18.9,2.25,12.59,4.53,6.32,6.76,0'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 32.59 10.97'
        className='animated-logo-element A2'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate5'
          d='M5.29.21C11.17.22,17.1.07,23,.07a15.05,15.05,0,0,1,2.69,0c.63.15,1.24,1.12,1.83,1.71C29.24,3.55,31,5.2,32.59,7,21.81,8.35,10.79,9.48.11,11c-.34-.18.23-.3.26-.53A85.51,85.51,0,0,0,5.29.21'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 20.87 45.02'
        className='animated-logo-element A3'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate6'
          d='M0,0Q7.64.9,15.36,1.71C17.16,16.18,19,30.58,20.87,45c-.45-.29-.58-.85-.79-1.31C13.5,29.3,6.68,14.72.06.2,0,.19,0,.08,0,0'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 10.24 6.36'
        className='animated-logo-element I21'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate14'
          d='M9.71,0c.16,2.1.47,4.39.53,6.36H0V.2C0,.11,0,0,.07,0Z'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 9.23 37.8'
        className='animated-logo-element I22'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate15'
          d='M8,37.8H0c1.05-12.43,1.94-25,3-37.41C5,.28,7.05.18,9,0c.36.21.21.77.2,1.05C8.9,13.11,8.37,25.65,8,37.8'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 10.89 7.68'
        className='animated-logo-element I1'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate9'
          d='M10.89.59C10.55,3,10.11,5.27,9.78,7.68c-3.3-.4-6.5-.9-9.78-1.32V.2A.18.18,0,0,1,.13,0C3.7.22,7.34.36,10.89.59'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 5.38 39.45'
        className='animated-logo-element I2'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate10'
          d='M.59.2C.59.11.58,0,.66,0H5.05c.11,13.13.18,26.3.33,39.38-1.66.15-3.61,0-5.38.06C.21,26.38.37,13.26.59.2'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 7.22 40.56'
        className='animated-logo-element L1'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate1'
          d='M5.78,0c.56,13.44,1,27,1.44,40.56-2.14-.1-4.33-.13-6.43-.26C.48,27,.24,13.59,0,.2,0,.11,0,0,.07,0Z'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 36.68 36.68'
        className='animated-logo-element L2'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate2'
          d='M18.9,7.48c6-2.4,11.81-4.9,17.78-7.29C30.59,12.33,24,24.55,17.72,36.68a4.68,4.68,0,0,1-.33-2c-.16-1.94-.35-4.15-.53-6.17-4.24.7-8.33,1.56-12.53,2.29C2.87,20.76,1.36,10.7,0,.53,5.91.4,11.68.13,17.58,0L18.9,7.48'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 27.89 8.2'
        className='animated-logo-element L3'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate3'
          d='M27.89,0c-.26,1.82-.56,3.6-.79,5.45C18.11,6.4,9,7.28,0,8.2.51,6.29,1,4.32,1.44,2.36,10.2,1.56,19,.84,27.76,0Z'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 39.05 28.64'
        className='animated-logo-element N1'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate17'
          d='M36.22,0q1.38,14.34,2.83,28.62c-.38.13-.8-.41-1.18-.66C26.11,20.09,14.09,12.24,2.3,4.33A10.76,10.76,0,0,1,0,2.56c5.56-.88,11.43-1.09,17.39-1.51C23.62.62,30,.35,36.22,0'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 33.41 27.27'
        className='animated-logo-element N2'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate16'
          d='M1.58,0c10,8.22,20,16.43,29.92,24.74a7.79,7.79,0,0,1,1.91,1.71c-11.16.24-22.32.48-33.41.78C.39,18.36,1,9.13,1.51.11c0-.12.06-.14.07-.07'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 14.11 33.93'
        className='animated-logo-element N3'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate18'
          d='M2.76.2c.05-.06,0-.18.13-.2C6.67.41,10.4.89,14.11,1.38c-.14,10.86-.31,21.69-.46,32.55H0C.86,22.62,1.9,11.5,2.76.2'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 17.64 20.1'
        className='animated-logo-element R1'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate11'
          d='M0,.61C4.57-.55,10.09-.1,13.45,2.25a9.31,9.31,0,0,1,2.82,3c1.05,1.76,2,4.48.79,6.5-1.39,2.29-4.37,3.82-7,5.05a57.3,57.3,0,0,1-8.8,3.28C.78,13.66.45,7.07,0,.61'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 26.19 14.63'
        className='animated-logo-element R2'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate12'
          d='M24.75,13.71c.47.26,1.14.38,1.44.92-8.5-.62-17-1.21-25.53-1.84C.43,8.55.26,4.22,0,0,8.19,4.38,16.55,9.22,24.75,13.71'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 27.96 38.72'
        className='animated-logo-element R3'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate13'
          d='M28,0c-1.78,12.94-3.68,25.76-5.44,38.72-7.6-3.59-15-7.34-22.52-11a4.76,4.76,0,0,1,1.77-.52c6.39-1.7,12.72-3.86,17.47-7.48,1.86-1.43,4-3.36,3.73-6.7-.32-3.5-3.47-5.4-6.16-6.69A32,32,0,0,0,9.58,3.87,9.85,9.85,0,0,1,7,3.28C14,2.19,20.94,1.13,27.83,0Z'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 38.26 41.6'
        className='animated-logo-element T1'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate19'
          d='M25.07,12.47c-.79,9.65-1.44,19.43-2.16,29.13-1.75,0-3.3-.24-5.06-.26-.47-10-.78-20.13-1.25-30.12Q8.35,10.56,0,10C.13,6.65.09,3.15.4,0,13,1.07,25.69,2.1,38.26,3.21c-.14,2.84-.21,5.75-.33,8.61-4.25.25-8.61.39-12.86.65'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 10.96 31.5'
        className='animated-logo-element T2'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate20'
          d='M0,31.5C1.75,21.06,3.25,10.38,5.05,0H10.3c.26,10.46.41,21,.66,31.5Z'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 22.64 32.03'
        className='animated-logo-element V1'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate7'
          d='M0,0C7.54.88,15,1.81,22.64,2.63c-5,9.26-10.29,18.46-15.42,27.69-.33.59-.51,1.33-1.12,1.71C4.1,21.32,2,10.67,0,0'
        />
      </svg>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 19.29 38.39'
        className='animated-logo-element V2'
      >
        <motion.path
          variants={pathVariants}
          initial='initial'
          animate='animate8'
          d='M0,35.64C3.77,25.5,7.77,14.87,11.75,4.53,12.33,3,13,1.17,13.58,0c1.94.54,3.83,1.12,5.71,1.71-.74,12.23-1.54,24.39-2.23,36.68C11.48,37.63,5.7,36.49,0,35.64'
        />
      </svg>
    </div>
  );
};

export default Loader;
