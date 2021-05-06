import { Fragment, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAuthContext } from '../../contexts/auth/authContext';
import { useComicsContext } from '../../contexts/comics/comicsContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import BackButton from '../../components/BackButton/BackButton';
import Image from '../../components/Image/Image';
import './Titles.css';

const Editions = () => {
  const [isPicLoading, setIsPicLoading] = useState(true);
  const [isMessage, setIsMessage] = useState(false);
  const {
    removeComic,
    getComicsByEditionId,
    message,
    emptyMessages,
    errorMessage,
    editionList,
    isLoading,
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
    history.push(`/comics/${id}`);
  };

  return (
    <Fragment>
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}
      <div
        className='titles-container opacity'
        style={
          !isLoading && !isPicLoading ? { opacity: '1' } : { opacity: '0' }
        }
      >
        <BackButton />

        {!editionList && <div>Još nema nijednog stripa!</div>}
        {editionList &&
          editionList.map((comic, i) => (
            <div className='title-container' key={i}>
              <div
                className='title-image-container'
                onClick={() => getComic(comic.id)}
              >
                <Image
                  src={comic.imgs[0]}
                  alt={comic.title}
                  className='title-image'
                  setIsPicLoading={setIsPicLoading}
                />
              </div>
              <div className='title-image-description'>
                {comic.title} {comic.nr}
              </div>
              {!!token && (
                <Fragment>
                  <button
                    onClick={() => history.push(`/comics/edit/${comic.id}`)}
                    className='yellow-button three-dots-top'
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: '-0.38rem',
                        left: '0.68rem',
                      }}
                    >
                      &hellip;
                    </span>
                  </button>
                  <button
                    onClick={() => removeComic(comic.id, token)}
                    className='red-button circle-top'
                  >
                    X
                  </button>
                </Fragment>
              )}
            </div>
          ))}
      </div>
    </Fragment>
  );
};

export default Editions;
