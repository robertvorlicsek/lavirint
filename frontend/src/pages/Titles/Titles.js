import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../contexts/auth/authContext';
import { useComicsContext } from '../../contexts/comics/comicsContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import Image from '../../components/Image/Image';
import './Titles.css';

const Editions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMessage, setIsMessage] = useState(false);
  const {
    removeComic,
    getComicsByEditionId,
    message,
    emptyMessages,
    errorMessage,
    editionList,
  } = useComicsContext();
  const { token } = useAuthContext();
  const parEditionId = useParams().editionId;

  useEffect(() => {
    let time;
    message || errorMessage ? (time = 3000) : (time = 300);
    (message || errorMessage) && setIsMessage(true);
    let timeout = setTimeout(() => {
      emptyMessages();
      setIsMessage(false);
    }, time);
    getComicsByEditionId(parEditionId);
    return () => {
      clearTimeout(timeout);
    };
  }, [
    getComicsByEditionId,
    emptyMessages,
    errorMessage,
    message,
    parEditionId,
  ]);

  return (
    <Fragment>
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}
      <div
        className='comics-container opacity'
        style={!isLoading ? { opacity: '1' } : { opacity: '0' }}
      >
        {!editionList && <div>Još nema nijednog stripa!</div>}
        {editionList &&
          editionList.map((comic, i) => (
            <div className='comic-container' key={i}>
              <div className='comic-image-container'>
                <Image
                  src={comic.img}
                  alt={comic.title}
                  className='comic-image'
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </div>
              <div className='comic-image-description'>
                {comic.title} {comic.nr}
              </div>
              {!!token && (
                <button
                  onClick={() => removeComic(comic.id, token)}
                  className='red-button'
                >
                  obriši strip
                </button>
              )}
            </div>
          ))}
      </div>
    </Fragment>
  );
};

export default Editions;
