import { Link } from 'react-router-dom';
import { useComicsContext } from '../../contexts/comicsContext';
import './Editions.css';

const Editions = () => {
  const { comicsList, getEditionId } = useComicsContext();

  return (
    <div className='editions-container'>
      {comicsList.map(
        (comic, i) =>
          comic.logo && (
            <Link
              key={comic.id}
              className='edition-link'
              to={`/editions/series/${comic.editionId}`}
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
