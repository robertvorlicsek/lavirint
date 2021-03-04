import { useHistory } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePromosContext } from '../../contexts/promos/promosContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import Image from '../../components/Image/Image';
import './Main.css';

const Main = () => {
  let history = useHistory();
  const {
    getPromos,
    promosList,
    setPromoAsFirst,
    message,
    errorMessage,
    emptyMessages,
  } = usePromosContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isMessage, setIsMessage] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const [promoInd, setPromoInd] = useState(0);

  useEffect(() => {
    let time;
    message || errorMessage ? (time = 3000) : (time = 300);
    (message || errorMessage) && setIsMessage(true);
    let timeout = setTimeout(() => {
      emptyMessages();
      setIsMessage(false);
    }, time);
    getPromos();
    return () => {
      clearTimeout(timeout);
    };
  }, [getPromos, message, errorMessage, emptyMessages]);

  useEffect(() => {
    setShowPromo(true);
    let animTimeout = setTimeout(() => {
      setShowPromo(false);
      setPromoInd(i => {
        if (promosList.length > i + 1) {
          return i + 1;
        } else {
          return 0;
        }
      });
    }, 8000);

    return () => {
      clearTimeout(animTimeout);
    };
  }, [promosList, promoInd]);

  const newsButtonHandler = id => {
    setPromoAsFirst(id);
    history.push('/news');
  };

  console.log(promoInd);

  return (
    <Fragment>
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}
      <div className='main-page'>
        <AnimatePresence>
          {!promosList && <div>Još nema nijedne najave!</div>}
          {promosList.length !== 0 && showPromo && (
            <motion.div
              key={promosList[promoInd].id}
              className='main-promo-item '
              // style={!isLoading ? { opacity: '1' } : { opacity: '0' }}
              initial={
                !isLoading && promosList.length > 1
                  ? {
                      rotateY: '20deg',
                      skewX: 20,
                      skewY: -20,
                      opacity: 0,
                      display: 'none',
                    }
                  : {
                      opacity: 0,
                      display: 'none',
                    }
              }
              animate={
                !isLoading && promosList.length > 1
                  ? {
                      skewX: 0,
                      rotateY: '0deg',
                      skewY: 0,
                      opacity: 1,
                      display: 'flex',
                    }
                  : {
                      opacity: 1,
                      display: 'flex',
                    }
              }
              transition={
                !isLoading && promosList.length > 1
                  ? { duration: 0.2 }
                  : { delay: 0.5, duration: 0.5 }
              }
              exit={
                promosList.length > 1 && {
                  rotateY: '-20deg',
                  skewX: -20,
                  skewY: 20,
                  opacity: 0,
                  display: 'none',
                }
              }
            >
              <div style={{ zIndex: 1 }}>
                <Image
                  src={promosList[promoInd].promoImg}
                  alt={promosList[promoInd].promoTitle}
                  className='main-promo-pic'
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </div>

              <div className='main-promo-text-container'>
                <div className='main-promo-title'>
                  {promosList[promoInd].promoTitle}
                </div>
                <div className='main-promo-text'>
                  {promosList[promoInd].promoText}
                </div>

                <button
                  onClick={() => newsButtonHandler(promosList[promoInd].id)}
                  className='red-button link-button more-button'
                >
                  Detaljnije...
                </button>
              </div>
              <div className='main-promo-text-container-filler'>
                &nbsp;
                <br />
                &nbsp;
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Fragment>
  );
};

export default Main;
