import { Fragment, useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { usePromosContext } from '../../contexts/promos/promosContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import Image from '../../components/Image/Image';
import './News.css';

const replaceText = text => {
  if (text.includes('-do ovde!-')) {
    const newsText = text.replace('-do ovde!-', '');
    return newsText;
  } else {
    return text;
  }
};

const News = () => {
  const {
    getPromos,
    promosList,
    deletePromo,
    message,
    errorMessage,
    emptyMessages,
  } = usePromosContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isMessage, setIsMessage] = useState(false);

  useEffect(() => {
    let time;
    message || errorMessage ? (time = 3000) : (time = 300);
    (message || errorMessage) && setIsMessage(true);
    let timeout = setTimeout(() => {
      emptyMessages();
      setIsMessage(false);
    }, time);
    promosList.length === 0 && getPromos();
    console.log(
      '🚀 ~ file: News.js ~ line 28 ~ useEffect ~ promosList',
      promosList
    );
    return () => {
      clearTimeout(timeout);
    };
  }, [getPromos, message, errorMessage, emptyMessages, promosList]);
  return (
    <Fragment>
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}

      <div className='news-page-container'>
        <h1 className='news-title'>OGLASNA TABLA</h1>
        <div className='news-container'>
          {!promosList && <div>Još nema nijedne najave!</div>}
          {promosList &&
            promosList.map(p => {
              return (
                <div
                  className='news-item opacity'
                  key={p.id}
                  style={!isLoading ? { opacity: '1' } : { opacity: '0' }}
                >
                  <div className='news-item-text-container'>
                    <h2 className='news-item-title'>{parse(p.promoTitle)}</h2>
                    <div className='news-item-text'>
                      <Image
                        src={p.promoImg}
                        alt={p.promoTitle}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        className='news-item-pic'
                      />
                      <br /> <br />
                      {parse(replaceText(p.promoText))}
                    </div>
                    <button
                      onClick={() => deletePromo(p.id)}
                      className='red-button news-item-delete-button'
                      disabled={promosList.length === 1}
                    >
                      Obriši najavu
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Fragment>
  );
};

export default News;
