import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useComicsContext } from '../../contexts/comicsContext';
import './Editions.css';

const Editions = () => {
  const { getComics, comicsList, getEditionId } = useComicsContext();

  useEffect(() => {
    getComics();
  }, [getComics]);

  return (
    <div className='editions-container'>
      {comicsList.map(
        (comic, i) =>
          comic.logo && (
            <Link
              className='edition-link'
              to={`/editions/${comic.editionId}`}
              onClick={() => getEditionId(comic.editionId)}
            >
              <div className='edition-container' key={i}>
                <div className='edition-image-container'>
                  <img
                    src={comic.logo}
                    alt={comic.title}
                    className='edition-image'
                  />
                </div>
                <div className='edition-image-description'>{comic.title}</div>
              </div>
            </Link>
          )
      )}
    </div>
  );
};

export default Editions;
