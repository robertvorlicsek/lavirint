import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useComicsContext } from '../../contexts/comics/comicsContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import BackButton from '../../components/BackButton/BackButton';
import Image from '../../components/Image/Image';
import './Comic.css';

const Comic = () => {
  const {
    // removeComic,
    comic,
    getComicByComicId,
    message,
    emptyMessages,
    errorMessage,
  } = useComicsContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isMessage, setIsMessage] = useState(false);
  const [imgsOrder, setImgsOrder] = useState(null);
  const [imgEffect, setImgEffect] = useState('false');
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

  useEffect(() => {
    setImgsOrder(comic.imgs);
  }, [comic]);

  const shuffleImgs = img => {
    setImgEffect('');
    setImgsOrder(images => {
      const otherImgs = images.filter(i => i !== img);
      return [img, ...otherImgs.sort()];
    });
    setImgEffect('fadeIn');
  };

  return (
    <Fragment>
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}
      <div
        className='comic-main-container opacity'
        style={!isLoading ? { opacity: '1' } : { opacity: '0' }}
      >
        <BackButton />

        {!comic && <div>Podaci o ovom stripu nisu uspeli da se učitaju!</div>}
        {comic && imgsOrder && (
          <Fragment>
            <div className='comic-name'>
              {comic.title} {comic.nr}
            </div>
            <div className='comic-container' key={comic.id}>
              <div className='comic-images-container'>
                <div className='first-comic-image-container'>
                  <Image
                    src={imgsOrder[0]}
                    alt={comic.title}
                    className={`first-comic-image ${imgEffect}`}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                  />
                </div>

                <div className='second-and-third-images-container'>
                  <div
                    className='second-comic-image-container'
                    onClick={() => shuffleImgs(imgsOrder[1])}
                    onMouseOut={() => setImgEffect('')}
                  >
                    <Image
                      src={imgsOrder[1]}
                      alt={comic.title}
                      className={`comic-image ${imgEffect}`}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                  </div>
                  <div
                    className='third-comic-image-container'
                    onClick={() => shuffleImgs(imgsOrder[2])}
                    onMouseOut={() => setImgEffect('')}
                  >
                    <Image
                      src={imgsOrder[2]}
                      alt={comic.title}
                      className={`comic-image ${imgEffect}`}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                  </div>
                </div>
              </div>

              <div className='comic-description-container'>
                <p className='comic-year comic-description'>
                  Godina izdavanja: 2021
                </p>
                <p className='comic-series comic-description'>
                  Serijal: Životinjska karma
                </p>
                <p className='comic-writer comic-description'>
                  Scenario: Frank Cho
                </p>
                <p className='comic-artist comic-description'>
                  Crtež: Frank Cho
                </p>
                <p className='comic-title-page-artist comic-description'>
                  Naslovna strana: Frank Cho
                </p>
                <p className='comic-original-title comic-description'>
                  Originalni naslov: Liberty Meadows
                </p>
                <p className='comic-original-nr comic-description'>
                  Broj originalne edicije: Nepoznato
                </p>
                <p className='comic-origin-country comic-description'>
                  Zemlja: SAD
                </p>
                <p className='comic-size comic-description'>Format: A4</p>
                <p className='comic-finish comic-description'>
                  Povez: Meki povez
                </p>
                <p className='comic-page-nr comic-description'>
                  Broj strana: 48
                </p>
                <p className='comic-color comic-description'>Boja: Crno-belo</p>
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
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default Comic;
