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
    getComics,
    message,
    emptyMessages,
    errorMessage,
    isLoading,
  } = useComicsContext();
  const [uniqueEditions, setUniqueEditions] = useState([]);
  const [isPicLoading, setIsPicLoading] = useState(true);
  const [isMessage, setIsMessage] = useState(false);

  useEffect(() => {
    getComics();
  }, [getComics]);

  useEffect(() => {
    let time;
    message || errorMessage ? (time = 3000) : (time = 300);
    (message || errorMessage) && setIsMessage(true);
    let timeout = setTimeout(() => {
      emptyMessages();
      setIsMessage(false);
    }, time);
    if (comicsList) {
      const filtered = comicsList.filter(
        (v, i, a) => a.findIndex(t => t.editionId === v.editionId) === i
      );
      setUniqueEditions(filtered);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [comicsList, message, errorMessage, emptyMessages]);

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
        uniqueEditions.map(
          (comic, i) =>
            comic.logo && (
              <Link
                key={i}
                className='edition-link'
                to={`/editions/${comic.editionId}`}
                onClick={() => getEditionId(comic.editionId)}
              >
                <div className='edition-container '>
                  <div className='edition-logo-container'>
                    <Image
                      src={comic.logo}
                      alt={comic.title}
                      className='edition-logo'
                      setIsPicLoading={setIsPicLoading}
                    />
                  </div>
                </div>
              </Link>
            )
        )}
    </div>
  );
};

export default Editions;
