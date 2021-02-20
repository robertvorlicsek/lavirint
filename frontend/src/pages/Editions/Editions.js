import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useComicsContext } from '../../contexts/comicsContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import './Editions.css';

const Editions = () => {
  const { comicsList, getEditionId, getComics } = useComicsContext();
  const [uniqueEditions, setUniqueEditions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getComics();
  }, [getComics, setIsLoading]);

  useEffect(() => {
    setIsLoading(true);
    let timeout = setTimeout(() => setIsLoading(false), 300);
    const filtered = comicsList.filter(
      (v, i, a) => a.findIndex(t => t.logo === v.logo) === i
    );

    setUniqueEditions(filtered);
    return () => {
      clearTimeout(timeout);
    };
  }, [comicsList, setIsLoading]);

  return (
    <div className='editions-container'>
      {isLoading && <LoadingOverlay />}
      {uniqueEditions.map(
        (comic, i) =>
          comic.logo && (
            <Link
              key={i}
              className='edition-link'
              to={`/editions/comic/titles`}
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
