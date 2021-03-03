import { useState } from 'react';
import { reveal as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';

import './NavMenu.css';

const NavMenu = ({ pageWrapId, outerContainerId }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const stateChangeHandler = newState => setMenuOpen(newState.isOpen);

  return (
    <Menu
      pageWrapId={pageWrapId}
      outerContainerId={outerContainerId}
      isOpen={menuOpen}
      onStateChange={state => stateChangeHandler(state)}
    >
      <Link onClick={closeMenu} id='promo' className='menu-item' to='/promo'>
        Početna
      </Link>
      <Link onClick={closeMenu} id='editions' className='menu-item' to='/news'>
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
      {/* <Link onClick={showSettings} className='menu-item--small' href='#!'>
        Settings
      </Link> */}
    </Menu>
  );
};

export default NavMenu;
