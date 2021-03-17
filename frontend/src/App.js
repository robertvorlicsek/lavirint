import { Fragment, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useWindowDimensions from './hooks/useWindowDimensions';
import Loader from './pages/Loader/Loader';
import NavMenu from './pages/NavMenu/NavMenu';
import Routes from './routes/Routes';
import { useSettingsContext } from './contexts/settings/settingsContext';
import { useAuthContext } from './contexts/auth/authContext';

import './App.css';

const App = () => {
  const location = useLocation();
  const { height, width } = useWindowDimensions();
  const { settings, introDisabled } = useSettingsContext();
  const { loggedIn } = useAuthContext();

  const scaleRatio = (width / 16 - ((width / 100) * 20) / 16) / 12;
  // console.log('🚀 ~ file: App.js ~ line 119 ~ App ~ scaleRatio', scaleRatio);

  console.log(introDisabled);

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
          style={{ backgroundImage: `url(${settings.backgroundImg})` }}
        >
          {(!loggedIn || location.pathname === '/promo') && !introDisabled ? (
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
              <Loader />
            </motion.div>
          ) : (
            <Fragment>
              <div className='app-loader-container'>
                <Loader />
              </div>
              <Routes />
            </Fragment>
          )}
          <Routes />
        </main>
      </div>
    </div>
  );
};

export default App;
