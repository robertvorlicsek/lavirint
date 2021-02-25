import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useComicsContext } from '../../contexts/comics/comicsContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import './Titles.css';

const Editions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    editionId,
    removeComic,
    getComicsByEditionId,
    message,
    emptyMessages,
    errorMessage,
    editionList,
  } = useComicsContext();
  const parEditionId = useParams().editionId;

  useEffect(() => {
    let time;
    message || errorMessage ? (time = 3000) : (time = 300);
    setIsLoading(true);
    let timeout = setTimeout(() => {
      emptyMessages();
      setIsLoading(false);
    }, time);
    getComicsByEditionId(parEditionId);
    return () => {
      clearTimeout(timeout);
    };
  }, [
    editionId,
    getComicsByEditionId,
    emptyMessages,
    errorMessage,
    message,
    parEditionId,
  ]);

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
