import { Route, Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
// import Loader from './pages/Loader/Loader';
import Header from './pages/Header/Header';
import Main from './pages/Main/Main';
import Editions from './pages/Editions/Editions';
import Comics from './pages/Comics/Comics';
import { ComicsProvider } from './contexts/comicsContext';
import { withAuthenticator } from '@aws-amplify/ui-react';
import './App.css';

const App = () => {
  return (
    <ComicsProvider>
      <div className='app'>
        {/* <Loader /> */}
        <Header />

        <AnimatePresence exitBeforeEnter onExitComplete={() => {}}>
          <Switch>
            <Route path='/' exact>
              <Main />
            </Route>
            <Route path='/editions' exact>
              <Editions />
            </Route>
            <Route path='/editions/:id' exact>
              <Comics />
            </Route>
          </Switch>
        </AnimatePresence>
      </div>
    </ComicsProvider>
  );
};

export default withAuthenticator(App);
