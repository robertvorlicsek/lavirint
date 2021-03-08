import { useState, useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useSettingsContext } from '../../contexts/settings/settingsContext';
import { usePromosContext } from '../../contexts/promos/promosContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import ImageUploader from '../../components/ImageUploader/ImageUploader';
import Image from '../../components/Image/Image';

import './SettingsPage.css';

const SettingsPage = () => {
  const {
    register,
    handleSubmit,
    // formState,
    // watch, errors
  } = useForm({
    mode: 'onChange',
  });
  const {
    settings,
    getSettings,
    updateSettings,
    message,
    errorMessage,
  } = useSettingsContext();
  const { promosList, getPromos } = usePromosContext();
  const [backgroundPicture, setBackgroundPicture] = useState([]);
  const [isMessage, setIsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfPromos, setNumberOfPromos] = useState(null);
  const [submitNow, setSubmitNow] = useState(false);
  useEffect(() => {
    getSettings();
    getPromos();
  }, [getSettings, getPromos]);

  const onSubmit = data => {
    if (submitNow) {
      setIsMessage(true);
      if (backgroundPicture.length === 1) {
        data.backgroundImg = backgroundPicture[0];
      } else {
        data.backgroundImg = settings.backgroundImg;
      }
      data.cloudinaryBackgroundImgId = settings.cloudinaryBackgroundImgId;
      if (data.backgroundImg) {
        console.log(data);
        updateSettings(data);
      }
    }
  };

  const nrOfPromosHandler = e => {
    setNumberOfPromos(e.target.value);
  };

  return (
    <Fragment>
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}
      <div
        className='settings-container opacity'
        style={!isLoading ? { opacity: '1' } : { opacity: '0' }}
      >
        <h1 className='settings-title'>Podešavanja</h1>
        <form className='settings-form' onSubmit={handleSubmit(onSubmit)}>
          <label className='settongs-label'>
            Broj najava vidljivih na prvoj strani:
            <br />
            <span className='red-warning-text'>
              Broj mora da bude manji od{' '}
              <span className='red-warning-text'>{promosList.length + 1}</span>
            </span>
            <br />
            <input
              type='number'
              name='nrOfPromos'
              value={numberOfPromos || settings.nrOfPromos}
              onChange={nrOfPromosHandler}
              className='settings-input settings-hover'
              ref={register({
                required: true,
              })}
            />
          </label>
          <label className='settings-label'>
            Stari background:
            <Image
              src={settings.backgroundImg}
              alt='old background'
              className='settings-old-background'
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </label>
          {/* <label className='new-promo-label'>
            Novi Background: */}
          <ImageUploader
            setBackgroundPicture={setBackgroundPicture}
            name='backgroundImg'
            register={register}
          />
          {/* </label> */}
          <button
            // disabled={!formState.isDirty || !formState.isValid}
            disabled={numberOfPromos > promosList.length}
            type='submit'
            value='Submit'
            className='settings-submit'
            onClick={() => setSubmitNow(true)}
          >
            Submit
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default SettingsPage;
