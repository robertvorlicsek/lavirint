import { useEffect } from 'react';
import {
  Route,
  Switch,
  // useLocation
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
// import Loader from './pages/Loader/Loader';
import Header from './pages/Header/Header';
import Main from './pages/Main/Main';
import Editions from './pages/Editions/Editions';
import Comics from './pages/Comics/Comics';
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
      {/* <Loader /> */}
      <Header />
      <AnimatePresence exitBeforeEnter onExitComplete={() => {}}>
        <Switch>
          <Route path='/editions/series/:editionId' exact>
            <Comics />
          </Route>
          <Route path='/editions/newcomic' exact>
            <NewComic />
          </Route>
          <Route path='/editions' exact>
            <Editions />
          </Route>
          <Route path='/' exact>
            <Main />
          </Route>
        </Switch>
      </AnimatePresence>
    </div>
  );
};

export default App;
