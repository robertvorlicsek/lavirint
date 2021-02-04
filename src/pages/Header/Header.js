import HeaderLogo from './HeaderLogo';
import Menu from '../Menu/Menu';
import './Header.css';

const Header = () => {
  return (
    <div className='header-main'>
      <Menu />
      <HeaderLogo />
    </div>
  );
};

export default Header;
