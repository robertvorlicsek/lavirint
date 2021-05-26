import { useState, Fragment } from 'react';
import { reveal as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/auth/authContext';
import { useSettingsContext } from '../../contexts/settings/settingsContext';

import './NavMenu.css';

const NavMenu = ({ pageWrapId, outerContainerId }) => {
  const { token } = useAuthContext();
  const { settings } = useSettingsContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const stateChangeHandler = newState => setMenuOpen(newState.isOpen);

  var styles = {
    bmMenu: {
      background: '#000',
      padding: '2.5em 1.5em 0',
      fontSize: '1.6rem',
      backgroundImage:
        settings &&
        settings.menuBackgroundImgs &&
        `url(${settings.menuBackgroundImgs[0]})`,
    },
  };

  let links;

  if (!!token) {
    links = (
      <Menu
        pageWrapId={pageWrapId}
        outerContainerId={outerContainerId}
        isOpen={menuOpen}
        onStateChange={state => stateChangeHandler(state)}
        styles={styles}
      >
        <Link onClick={closeMenu} id='promo' className='menu-item' to='/promo'>
          Početna
        </Link>
        <Link onClick={closeMenu} id='news' className='menu-item' to='/news'>
          Vesti
        </Link>
        <Link
          onClick={closeMenu}
          id='editions'
          className='menu-item'
          to='/editions'
        >
          Edicije
        </Link>
        <Link
          onClick={closeMenu}
          id='newcomic'
          className='menu-item'
          to='/newcomic'
        >
          Novi strip
        </Link>
        <Link
          onClick={closeMenu}
          id='newpromo'
          className='menu-item'
          to='/newpromo'
        >
          Nova najava
        </Link>
        <Link
          onClick={closeMenu}
          id='settings'
          className='menu-item'
          to='/settings'
        >
          Podešavanja
        </Link>
      </Menu>
    );
  } else {
    links = (
      <Menu
        pageWrapId={pageWrapId}
        outerContainerId={outerContainerId}
        isOpen={menuOpen}
        onStateChange={state => stateChangeHandler(state)}
        styles={styles}
      >
        <Link onClick={closeMenu} id='promo' className='menu-item' to=''>
          Početna
        </Link>
        <Link onClick={closeMenu} id='news' className='menu-item' to='/news'>
          Vesti
        </Link>
        <Link
          onClick={closeMenu}
          id='editions'
          className='menu-item'
          to='/editions'
        >
          Edicije
        </Link>
      </Menu>
    );
  }

  return <Fragment>{links}</Fragment>;
};

export default NavMenu;
