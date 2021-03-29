import { Fragment, useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../../contexts/auth/authContext';
import { usePromosContext } from '../../contexts/promos/promosContext';
import { getFormatedDate } from '../../helpers/formatDate';
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
  const history = useHistory();
  const {
    getPromos,
    promosList,
    deletePromo,
    message,
    errorMessage,
    emptyMessages,
  } = usePromosContext();
  const { token } = useAuthContext();
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
                      <span>{getFormatedDate(p.promoDate)}</span>
                      <br /> <br />
                      {parse(replaceText(p.promoText))}
                    </div>
                    {!!token && (
                      <Fragment>
                        <button
                          onClick={() => history.push(`/promo/edit/${p.id}`)}
                          className='red-button news-item-edit-button'
                          disabled={promosList.length === 1}
                        >
                          Edituj
                        </button>
                        <button
                          onClick={() => deletePromo(p.id, token)}
                          className='red-button news-item-delete-button'
                          disabled={promosList.length === 1}
                        >
                          Obriši
                        </button>
                      </Fragment>
                    )}
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
