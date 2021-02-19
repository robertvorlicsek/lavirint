import ReactDOM from 'react-dom';
import Loader from 'react-loader-spinner';
import './LoadingOverlay.css';

const LoadingOverlay = () => {
  return ReactDOM.createPortal(
    <div className='loading-overlay-container'>
      <Loader
        type='Oval'
        color='#000'
        height={100}
        width={100}
        timeout={3000} //3 secs
      />
    </div>,
    document.getElementById('loading-overlay-hook')
  );
};

export default LoadingOverlay;
