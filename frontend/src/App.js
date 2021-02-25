import { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
// import Loader from './pages/Loader/Loader';
import NavMenu from './pages/NavMenu/NavMenu';
import Logo from './components/Logo/Logo';
import Main from './pages/Main/Main';
import Editions from './pages/Editions/Editions';
import Titles from './pages/Titles/Titles';
import NewComic from './pages/NewComic/NewComic';
import NewPromo from './pages/NewPromo/NewPromo';
import { ComicsProvider } from './contexts/comics/comicsContext';

import './App.css';

const App = () => {
  return (
    <div className='app'>
      <AnimatePresence exitBeforeEnter onExitComplete={() => {}}>
        <div id='outer-container'>
          {/* <Loader /> */}
          <NavMenu
            pageWrapId={'page-wrap'}
            outerContainerId={'outer-container'}
          />
          <main id='page-wrap' className='main-styles'>
            <Logo />
            <Switch>
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
                <ComicsProvider>
                  <NewPromo />
                </ComicsProvider>
              </Route>
              <Route path='/editions' exact>
                <ComicsProvider>
                  <Editions />
                </ComicsProvider>
              </Route>
              <Route path='/' exact>
                <Main />
              </Route>
            </Switch>
          </main>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default App;
