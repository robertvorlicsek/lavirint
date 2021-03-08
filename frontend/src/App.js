import { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
// import Loader from './pages/Loader/Loader';
import NavMenu from './pages/NavMenu/NavMenu';
import Logo from './components/Logo/Logo';
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

import './App.css';

const App = () => {
  const { settings, getSettings } = useSettingsContext();

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  return (
    <div className='app'>
      <AnimatePresence exitBeforeEnter onExitComplete={() => {}}>
        <div id='outer-container'>
          {/* <Loader /> */}
          <NavMenu
            pageWrapId={'page-wrap'}
            outerContainerId={'outer-container'}
          />
          <main
            id='page-wrap'
            className='main-styles'
            style={{ backgroundImage: `url(${settings.backgroundImg})` }}
          >
            <Logo />
            <Switch>
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
          </main>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default App;
