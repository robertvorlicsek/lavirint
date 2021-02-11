import { useComicsContext } from '../../contexts/comicsContext';
import './Comics.css';

const Editions = () => {
  const { comicsList, editionId } = useComicsContext();

  const filteredComics = comicsList.filter(
    comic => comic.editionId === editionId
  );

  return (
    <div className='comics-container'>
      {filteredComics.map((comic, i) => (
        <div className='comic-container' key={i}>
          <div className='comic-image-container'>
            <img src={comic.img} alt={comic.title} className='comic-image' />
          </div>
          <div className='comic-image-description'>
            {comic.title} {comic.nr}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Editions;
