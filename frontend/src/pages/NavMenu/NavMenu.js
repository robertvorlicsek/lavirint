import { useState } from 'react';
import { reveal as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';

import './NavMenu.css';

const NavMenu = ({ pageWrapId, outerContainerId }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  // const showSettings = event => {
  //   event.preventDefault();
  // };

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
      <Link onClick={closeMenu} id='home' className='menu-item' to='/'>
        Početna
      </Link>
      <Link onClick={closeMenu} id='about' className='menu-item' to='/editions'>
        Edicije
      </Link>
      <Link
        onClick={closeMenu}
        id='contact'
        className='menu-item'
        to='/editions/newcomic'
      >
        Novi strip
      </Link>
      {/* <Link onClick={showSettings} className='menu-item--small' href='#!'>
        Settings
      </Link> */}
    </Menu>
  );
};

export default NavMenu;
