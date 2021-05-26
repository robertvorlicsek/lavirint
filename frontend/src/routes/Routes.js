import { Route, Redirect, Switch } from 'react-router-dom';
import Auth from '../pages/Auth/Auth';
import Main from '../pages/Main/Main';
import News from '../pages/News/News';
import Editions from '../pages/Editions/Editions';
import Comic from '../pages/Comic/Comic';
import Titles from '../pages/Titles/Titles';
import NewComic from '../pages/NewComic/NewComic';
import NewPromo from '../pages/NewPromo/NewPromo';
import UpdatePromo from '../pages/UpdatePromo/UpdatePromo';
import UpdateComic from '../pages/UpdateComic/UpdateComic';
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
        <Route path='/comics/:cid' exact>
          <ComicsProvider>
            <Comic />
          </ComicsProvider>
        </Route>
        <Route path='/comics/edit/:cid' exact>
          <ComicsProvider>
            <UpdateComic />
          </ComicsProvider>
        </Route>
        <Route path='/news' exact>
          <PromosProvider>
            <News />
          </PromosProvider>
        </Route>
        <Route path='/promo' exact>
          <PromosProvider>
            <Main />
          </PromosProvider>
        </Route>
        <Route exact path='/'>
          <Redirect to='/promo' />
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
        <Route path='/comics/:cid' exact>
          <ComicsProvider>
            <Comic />
          </ComicsProvider>
        </Route>
        <Route path='/news' exact>
          <PromosProvider>
            <News />
          </PromosProvider>
        </Route>
        <Route path='/promo' exact>
          <PromosProvider>
            <Main />
          </PromosProvider>
        </Route>
        <Route exact path='/'>
          <Redirect to='/promo' />
        </Route>
      </Switch>
    );
  }
};

export default Routes;
