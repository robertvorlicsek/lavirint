import { AmplifySignOut } from '@aws-amplify/ui-react';
import HeaderLogo from './HeaderLogo';
import Menu from '../Menu/Menu';
import './Header.css';

const Header = () => {
  return (
    <div className='header-main'>
      <Menu />
      <HeaderLogo />
      <AmplifySignOut className='header-element-right' />
    </div>
  );
};

export default Header;
