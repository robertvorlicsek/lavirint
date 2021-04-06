import { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useWindowDimensions from './hooks/useWindowDimensions';
import Loader from './components/Loader/Loader';
import NavMenu from './components/NavMenu/NavMenu';
import Routes from './routes/Routes';
import { useSettingsContext } from './contexts/settings/settingsContext';
import { useAuthContext } from './contexts/auth/authContext';

import './App.css';

const App = () => {
  const location = useLocation();
  const { height, width } = useWindowDimensions();
  const { settings, introDisabled } = useSettingsContext();
  const { token } = useAuthContext();
  const [scrollTop, setScrollTop] = useState(0);

  const scaleRatio = (width / 16 - ((width / 100) * 20) / 16) / 12;

  useEffect(() => {
    window.addEventListener('scroll', e => setScrollTop(e.target.scrollTop), {
      capture: true,
    });
    return () => {
      window.removeEventListener(
        'scroll',
        e => setScrollTop(e.target.scrollTop),
        { capture: true }
      );
    };
  }, [scrollTop]);

  return (
    <div className='app'>
      <div id='outer-container'>
        <NavMenu
          pageWrapId={'page-wrap'}
          outerContainerId={'outer-container'}
        />
        <main
          id='page-wrap'
          className='main-styles'
          style={
            settings.backgroundImgs && {
              backgroundImage: `url(${settings.backgroundImgs[0]})`,
            }
          }
        >
          {(!token && location.pathname === '/' && !introDisabled) ||
          (!token && !introDisabled) ? (
            <motion.div
              style={{ originX: 0.5 }}
              className='app-loader-container'
              initial={{
                scale: scaleRatio,
                y:
                  height / 2 - (height / 100) * 10 - scaleRatio * (1.7976 * 16),
              }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 4 }}
            >
              <Loader scrollTop={scrollTop} setScrollTop={setScrollTop} />
            </motion.div>
          ) : (
            <Fragment>
              <div className='app-loader-container'>
                <Loader scrollTop={scrollTop} setScrollTop={setScrollTop} />
              </div>
            </Fragment>
          )}
          <Routes />
        </main>
      </div>
    </div>
  );
};

export default App;
