import { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useWindowDimensions from './hooks/useWindowDimensions';
import Loader from './pages/Loader/Loader';
import Auth from './pages/Auth/Auth';
import NavMenu from './pages/NavMenu/NavMenu';
// import Logo from './components/Logo/Logo';
import Main from './pages/Main/Main';
import News from './pages/News/News';
import Editions from './pages/Editions/Editions';
import Titles from './pages/Titles/Titles';
import NewComic from './pages/NewComic/NewComic';
import NewPromo from './pages/NewPromo/NewPromo';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import { ComicsProvider } from './contexts/comics/comicsContext';
import { PromosProvider } from './contexts/promos/promosContext';
import { useSettingsContext } from './contexts/settings/settingsContext';
import { useAuthContext } from './contexts/auth/authContext';

import './App.css';

const App = () => {
  const { height, width } = useWindowDimensions();
  const { settings, getSettings } = useSettingsContext();
  const { token } = useAuthContext();
  // const [showLoader, setShowLoader] = useState(true);

  // setTimeout(() => {
  //   setShowLoader(false);
  // }, 5000);

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path='/dekara' exact>
          <Auth />
        </Route>
        <Route path='/settings' exact>
          <PromosProvider>
            <SettingsPage />
          </PromosProvider>
        </Route>
        <Route path='/editions/:editionId' exact>
          <ComicsProvider>
            <Titles />
          </ComicsProvider>
        </Route>
        <Route path='/newcomic' exact>
          <ComicsProvider>
            <NewComic />
          </ComicsProvider>
        </Route>
        <Route path='/newpromo' exact>
          <PromosProvider>
            <NewPromo />
          </PromosProvider>
        </Route>
        <Route path='/editions' exact>
          <ComicsProvider>
            <Editions />
          </ComicsProvider>
        </Route>
        <Route path='/promo' exact>
          <PromosProvider>
            <Main />
          </PromosProvider>
        </Route>
        <Route path='/news' exact>
          <PromosProvider>
            <News />
          </PromosProvider>
        </Route>
        <Route exact path='/'>
          <Redirect to='/promo' />
        </Route>
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path='/dekara' exact>
          <Auth />
        </Route>
        <Route path='/editions/:editionId' exact>
          <ComicsProvider>
            <Titles />
          </ComicsProvider>
        </Route>
        <Route path='/editions' exact>
          <ComicsProvider>
            <Editions />
          </ComicsProvider>
        </Route>
        <Route path='/promo' exact>
          <PromosProvider>
            <Main />
          </PromosProvider>
        </Route>
        <Route path='/news' exact>
          <PromosProvider>
            <News />
          </PromosProvider>
        </Route>
        <Route exact path='/'>
          <Redirect to='/promo' />
        </Route>
      </Switch>
    );
  }

  const scaleRatio = (width / 16 - ((width / 100) * 20) / 16) / 12;
  console.log('🚀 ~ file: App.js ~ line 119 ~ App ~ scaleRatio', scaleRatio);

  return (
    <div className='app'>
      <AnimatePresence exitBeforeEnter onExitComplete={() => {}}>
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
            {!token && (
              <motion.div
                style={{ originX: 0.5 }}
                className='app-loader-container'
                initial={{
                  scale: scaleRatio,
                  y:
                    height / 2 -
                    (height / 100) * 10 -
                    scaleRatio * (1.7976 * 16),
                }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 4 }}
              >
                <Loader />
              </motion.div>
            )}
            {!token ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4 }}
              >
                {routes}
              </motion.div>
            ) : (
              <div>{routes}</div>
            )}
          </main>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default App;
