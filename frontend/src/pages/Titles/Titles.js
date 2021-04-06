import { Fragment, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAuthContext } from '../../contexts/auth/authContext';
import { useComicsContext } from '../../contexts/comics/comicsContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import BackButton from '../../components/BackButton/BackButton';
import Image from '../../components/Image/Image';
import './Titles.css';

const Editions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMessage, setIsMessage] = useState(false);
  const {
    removeComic,
    getComicsByEditionId,
    getComicByComicId,
    message,
    emptyMessages,
    errorMessage,
    editionList,
  } = useComicsContext();
  const { token } = useAuthContext();
  const parEditionId = useParams().editionId;
  const history = useHistory();

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

  const getComic = id => {
    console.log(id);
    getComicByComicId(id);
    history.push(`/comics/${id}`);
  };

  return (
    <Fragment>
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}
      <div
        className='titles-container opacity'
        style={!isLoading ? { opacity: '1' } : { opacity: '0' }}
      >
        <BackButton />

        {!editionList && <div>Još nema nijednog stripa!</div>}
        {editionList &&
          editionList.map((comic, i) => (
            <div className='title-container' key={i}>
              <div className='title-image-container'>
                <Image
                  src={comic.img}
                  alt={comic.title}
                  className='title-image'
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onClick={() => getComic(comic.id)}
                />
              </div>
              <div className='title-image-description'>
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
