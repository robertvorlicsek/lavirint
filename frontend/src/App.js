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
import { useComicsContext } from './contexts/comicsContext';
import './App.css';

const App = () => {
  const { getComics } = useComicsContext();

  useEffect(() => {
    getComics();
  }, [getComics]);

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
                <Titles />
              </Route>
              <Route path='/newcomic' exact>
                <NewComic />
              </Route>
              <Route path='/editions' exact>
                <Editions />
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
