import { Route, Switch } from 'react-router-dom';
import Auth from '../pages/Auth/Auth';
import Main from '../pages/Main/Main';
import News from '../pages/News/News';
import Editions from '../pages/Editions/Editions';
import Titles from '../pages/Titles/Titles';
import NewComic from '../pages/NewComic/NewComic';
import NewPromo from '../pages/NewPromo/NewPromo';
import UpdatePromo from '../pages/UpdatePromo/UpdatePromo';
import SettingsPage from '../pages/SettingsPage/SettingsPage';
import { ComicsProvider } from '../contexts/comics/comicsContext';
import { PromosProvider } from '../contexts/promos/promosContext';
import { useAuthContext } from '../contexts/auth/authContext';

const Routes = () => {
  const { token } = useAuthContext();
  if (token) {
    return (
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

        <Route path='/promo/edit/:id' exact>
          <PromosProvider>
            <UpdatePromo />
          </PromosProvider>
        </Route>
        <Route path='/news' exact>
          <PromosProvider>
            <News />
          </PromosProvider>
        </Route>
        <Route path='/' exact>
          <PromosProvider>
            <Main />
          </PromosProvider>
        </Route>
      </Switch>
    );
  } else {
    return (
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
        <Route path='/news' exact>
          <PromosProvider>
            <News />
          </PromosProvider>
        </Route>
        <Route path='/' exact>
          <PromosProvider>
            <Main />
          </PromosProvider>
        </Route>
      </Switch>
    );
  }
};

export default Routes;
