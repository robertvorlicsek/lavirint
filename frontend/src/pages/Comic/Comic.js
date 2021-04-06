import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useComicsContext } from '../../contexts/comics/comicsContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import BackButton from '../../components/BackButton/BackButton';
import Image from '../../components/Image/Image';
import './Comic.css';

const Comic = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMessage, setIsMessage] = useState(false);

  const {
    // removeComic,
    comic,
    getComicByComicId,
    message,
    emptyMessages,
    errorMessage,
  } = useComicsContext();

  //   const [comicId, setComicId] = useState(false);
  const parCId = useParams().cid;

  useEffect(() => {
    let time;
    message || errorMessage ? (time = 3000) : (time = 300);
    (message || errorMessage) && setIsMessage(true);
    let timeout = setTimeout(() => {
      emptyMessages();
      setIsMessage(false);
    }, time);
    getComicByComicId(parCId);
    return () => {
      clearTimeout(timeout);
    };
  }, [emptyMessages, errorMessage, message, getComicByComicId, parCId]);

  return (
    <Fragment>
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}
      <div
        className='main-comic-container opacity'
        style={!isLoading ? { opacity: '1' } : { opacity: '0' }}
      >
        <BackButton />

        {!comic && <div>Taj strip ne postoji!</div>}
        {comic && (
          <div className='comic-container' key={comic.id}>
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
            {/* {!!token && (
              <button
                //   onClick={() => removeComic(comic.id, token)}
                className='red-button'
              >
                obriši strip
              </button>
            )} */}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Comic;
