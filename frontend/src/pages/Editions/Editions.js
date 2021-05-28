import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useComicsContext } from '../../contexts/comics/comicsContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import Image from '../../components/Image/Image';
import './Editions.css';

const Editions = () => {
  const {
    comicsList,
    getEditionId,
    // getComics,
    getEditionsByEditionId,
    editionsList,
    message,
    emptyMessages,
    errorMessage,
    isLoading,
  } = useComicsContext();
  // const [uniqueEditions, setUniqueEditions] = useState([]);
  const [isPicLoading, setIsPicLoading] = useState(true);
  const [isMessage, setIsMessage] = useState(false);

  useEffect(() => {
    getEditionsByEditionId();
  }, [getEditionsByEditionId]);

  // useEffect(() => {
  //   getComics();
  // }, [getComics]);

  // useEffect(() => {
  //   if (comicsList) {
  //     const filtered = comicsList.filter(
  //       (v, i, a) => a.findIndex(t => t.editionId === v.editionId) === i
  //     );
  //     setUniqueEditions(filtered);
  //   }
  // }, [comicsList]);

  useEffect(() => {
    let time;
    message || errorMessage ? (time = 3000) : (time = 300);
    (message || errorMessage) && setIsMessage(true);
    let timeout = setTimeout(() => {
      emptyMessages();
      setIsMessage(false);
    }, time);
    return () => {
      clearTimeout(timeout);
    };
  }, [message, errorMessage, emptyMessages]);

  // console.log(uniqueEditions);

  return (
    <div
      className='editions-container opacity'
      style={
        !isLoading && (!isPicLoading || !comicsList)
          ? { opacity: '1' }
          : { opacity: '0' }
      }
    >
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}
      {!comicsList && (
        <div style={{ opacity: 1 }}>Još nema nijedne edicije!</div>
      )}
      {comicsList &&
        editionsList.map(
          (comic, i) =>
            comic.logo && (
              <div className='edition-container' key={i}>
                <Link
                  className='edition-link'
                  to={`/editions/${comic.editionId}`}
                  onClick={() => getEditionId(comic.editionId)}
                >
                  <div className='edition-logo-container'>
                    <Image
                      src={comic.logo}
                      alt={comic.title}
                      className='edition-logo'
                      setIsPicLoading={setIsPicLoading}
                    />
                  </div>{' '}
                </Link>
              </div>
            )
        )}
    </div>
  );
};

export default Editions;
