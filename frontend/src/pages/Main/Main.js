import { useHistory } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import parse from 'html-react-parser';
import { useSettingsContext } from '../../contexts/settings/settingsContext';
import { usePromosContext } from '../../contexts/promos/promosContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import Image from '../../components/Image/Image';
import './Main.css';

const formatedDate = date => {
  const days = [
    'Januar',
    'Februar',
    'Mart',
    'April',
    'Maj',
    'Jun',
    'Jul',
    'Avgust',
    'Septembar',
    'Oktobar',
    'Novembar',
    'Decembar',
  ];
  let year = date.slice(0, 4);
  let month = date.slice(5, 7);
  let day = date.slice(8, 10);
  month = days[parseInt(month) - 1];
  return `${day}. ${month} ${year}.`;
};

const splitText = text => {
  if (text.includes('-do ovde!-')) {
    const promoText = text.split('-do ovde!-');
    return promoText[0];
  } else {
    return text;
  }
};

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
  const { settings } = useSettingsContext();
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
    const newPromoNr = promosList.slice(0, settings.nrOfPromos);
    setShowPromo(true);
    if (newPromoNr.length !== 1) {
      let animTimeout = setTimeout(() => {
        setShowPromo(false);
        setPromoInd(i => {
          if (newPromoNr.length > i + 1) {
            return i + 1;
          } else {
            return 0;
          }
        });
      }, 8000);

      return () => {
        clearTimeout(animTimeout);
      };
    }
  }, [promosList, promoInd, settings]);

  const newsButtonHandler = id => {
    setPromoAsFirst(id);
    history.push('/news');
  };

  return (
    <Fragment>
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}
      <div className='main-page'>
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
              <div className='main-promo-date'>
                {formatedDate(promosList[promoInd].promoDate)}
              </div>
              <div className='main-promo-title'>
                {parse(promosList[promoInd].promoTitle)}
              </div>
              <div className='main-promo-text'>
                {parse(splitText(promosList[promoInd].promoText))}
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
      </div>
    </Fragment>
  );
};

export default Main;
