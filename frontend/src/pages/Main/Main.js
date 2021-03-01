import { Fragment, useEffect, useState } from 'react';
import { usePromosContext } from '../../contexts/promos/promosContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import Image from '../../components/Image/Image';
import './Main.css';

const Main = () => {
  const {
    getPromos,
    promosList,
    message,
    errorMessage,
    emptyMessages,
  } = usePromosContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isMessage, setIsMessage] = useState(false);

  useEffect(() => {
    getPromos();
  }, [getPromos]);

  useEffect(() => {
    let time;
    message || errorMessage ? (time = 3000) : (time = 300);
    (message || errorMessage) && setIsMessage(true);
    let timeout = setTimeout(() => {
      emptyMessages();
      setIsMessage(false);
    }, time);
    return () => {
      clearTimeout(timeout);
    };
  }, [message, errorMessage, emptyMessages]);

  console.log(promosList);

  return (
    <Fragment>
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}
      <div className='main-page'>
        {promosList.map(p => {
          return (
            <div
              key={p.id}
              className='main-promo-item opacity'
              style={!isLoading ? { opacity: '1' } : { opacity: '0' }}
            >
              <Image
                src={p.promoImg}
                alt={p.promoTitle}
                className='main-promo-pic'
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
              <div className='main-promo-text-container'>
                <div className='main-promo-title'>{p.promoTitle}</div>
                <div className='main-promo-text'>{p.promoText}</div>
              </div>
              <div className='main-promo-text-container-filler'>
                &nbsp;
                <br />
                &nbsp;
              </div>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default Main;
