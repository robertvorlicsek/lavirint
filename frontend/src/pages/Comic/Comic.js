import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
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
              {comic.info && (
                <div className='comic-description-container'>
                  {comic.info.comicYear && (
                    <p className='comic-year comic-description'>
                      Godina izdavanja: {comic.info.comicYear}
                    </p>
                  )}
                  {comic.info.comicSeries && (
                    <p className='comic-series comic-description'>
                      Serijal: {comic.info.comicSeries}
                    </p>
                  )}
                  {comic.info.comicWriter && (
                    <p className='comic-writer comic-description'>
                      Scenario: {comic.info.comicWriter}
                    </p>
                  )}
                  {comic.info.comicArtist && (
                    <p className='comic-artist comic-description'>
                      Crtež: {comic.info.comicArtist}
                    </p>
                  )}
                  {comic.info.comicTitleArtist && (
                    <p className='comic-title-page-artist comic-description'>
                      Naslovna strana: {comic.info.comicTitleArtist}
                    </p>
                  )}
                  {comic.info.comicOriginalTitle && (
                    <p className='comic-original-title comic-description'>
                      Originalni naslov: {comic.info.comicOriginalTitle}
                    </p>
                  )}
                  {comic.info.comicOriginalNr && (
                    <p className='comic-original-nr comic-description'>
                      Broj originalne edicije: {comic.info.comicOriginalNr}
                    </p>
                  )}
                  {comic.info.comicOriginCountry && (
                    <p className='comic-origin-country comic-description'>
                      Zemlja: {comic.info.comicOriginCountry}
                    </p>
                  )}
                  {comic.info.comicDimensions && (
                    <p className='comic-dimensions comic-description'>
                      Format: {comic.info.comicDimensions}
                    </p>
                  )}
                  {comic.info.comicFinish && (
                    <p className='comic-finish comic-description'>
                      Povez: {comic.info.comicFinish}
                    </p>
                  )}
                  {comic.info.comicPageNr && (
                    <p className='comic-page-nr comic-description'>
                      Broj strana: {comic.info.comicPageNr}
                    </p>
                  )}
                  {comic.info.comicColor && (
                    <p className='comic-color comic-description'>
                      Boja: {comic.info.comicColor}
                    </p>
                  )}
                  {comic.info.comicPreview && (
                    <p className='comic-preview comic-description'>
                      {parse(comic.info.comicPreview)}
                    </p>
                  )}
                </div>
              )}

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
