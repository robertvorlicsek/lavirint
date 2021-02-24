import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useComicsContext } from '../../contexts/comicsContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import './Editions.css';

const Editions = () => {
  const {
    comicsList,
    getEditionId,
    getComics,
    message,
    emptyMessages,
    errorMessage,
  } = useComicsContext();
  const [uniqueEditions, setUniqueEditions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   console.log(errorMessage);
  // }, [errorMessage]);

  useEffect(() => {
    getComics();
  }, [getComics]);

  useEffect(() => {
    let time;
    message || errorMessage ? (time = 3000) : (time = 300);
    setIsLoading(true);
    let timeout = setTimeout(() => {
      emptyMessages();
      setIsLoading(false);
    }, time);
    const filtered = comicsList.filter(
      (v, i, a) => a.findIndex(t => t.editionId === v.editionId) === i
    );
    setUniqueEditions(filtered);
    return () => {
      clearTimeout(timeout);
    };
  }, [comicsList, setIsLoading, message, errorMessage, emptyMessages]);

  return (
    <div className='editions-container'>
      {isLoading && <LoadingOverlay />}
      {uniqueEditions.map(
        (comic, i) =>
          comic.logo && (
            <Link
              key={i}
              className='edition-link'
              to={`/editions/${comic.editionId}`}
              onClick={() => getEditionId(comic.editionId)}
            >
              <div className='edition-container'>
                <div className='edition-logo-container'>
                  <img
                    src={comic.logo}
                    alt={comic.title}
                    className='edition-logo'
                  />
                </div>
                <div className='edition-logo-description'>{comic.title}</div>
              </div>
            </Link>
          )
      )}
    </div>
  );
};

export default Editions;
