import { useState, Fragment } from 'react';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import TextEditor from '../../components/TextEditor/TextEditor';
import './NewPromo.css';

const NewPromo = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Fragment>
      {isLoading && <LoadingOverlay />}
      <div className='new-promo-container'>
        <h1 className='new-promo-title'>Upload nove najave</h1>
        <TextEditor />
      </div>
    </Fragment>
  );
};

export default NewPromo;
