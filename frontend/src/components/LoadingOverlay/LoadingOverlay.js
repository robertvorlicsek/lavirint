import ReactDOM from 'react-dom';
import { useComicsContext } from '../../contexts/comicsContext';
import Loader from 'react-loader-spinner';
import './LoadingOverlay.css';

const LoadingOverlay = () => {
  const { message, errorMessage } = useComicsContext();

  return ReactDOM.createPortal(
    <div className='loading-overlay-container'>
      {message && <div className='message-text'>{message}</div>}
      {errorMessage && <div className='error-message-text'>{errorMessage}</div>}
      {!message && !errorMessage && (
        <Loader
          type='Oval'
          color='#000'
          height={100}
          width={100}
          timeout={500000} //3 secs
        />
      )}
    </div>,
    document.getElementById('loading-overlay-hook')
  );
};

export default LoadingOverlay;
