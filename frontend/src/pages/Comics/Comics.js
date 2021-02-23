import { useEffect, useState } from 'react';
import { useComicsContext } from '../../contexts/comicsContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import './Comics.css';

const Editions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    editionList,
    editionId,
    removeComic,
    getComicsByEditionId,
  } = useComicsContext();

  useEffect(() => {
    setIsLoading(true);
    let timeout = setTimeout(() => setIsLoading(false), 300);
    getComicsByEditionId(editionId);
    return () => {
      clearTimeout(timeout);
    };
  }, [getComicsByEditionId, editionId]);

  return (
    <div className='comics-container'>
      {isLoading && <LoadingOverlay />}
      {editionList.map((comic, i) => (
        <div className='comic-container' key={i}>
          <div className='comic-image-container'>
            <img src={comic.img} alt={comic.title} className='comic-image' />
          </div>
          <div className='comic-image-description'>
            {comic.title} {comic.nr}
          </div>
          <button
            onClick={() => removeComic(comic.id)}
            className='delete-comic'
          >
            obriši strip
          </button>
        </div>
      ))}
    </div>
  );
};

export default Editions;
