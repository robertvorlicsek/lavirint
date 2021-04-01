import { useState, useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../contexts/auth/authContext';
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
    updateSettings,
    message,
    errorMessage,
  } = useSettingsContext();
  const { token } = useAuthContext();
  const { promosList, getPromos } = usePromosContext();
  const [backgroundPicture, setBackgroundPicture] = useState([]);
  const [menuBackgroundPicture, setMenuBackgroundPicture] = useState([]);
  const [removedMenuBackground, setRemovedMenuBackground] = useState(null);
  const [newNrOfPromos, setNewNrOfPromos] = useState('');
  const [currentMenuBackground, setCurrentMenuBackground] = useState(null);
  const [isMessage, setIsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitNow, setSubmitNow] = useState(false);

  useEffect(() => {
    getPromos();
  }, [getPromos]);

  useEffect(() => {
    settings.menuBackgroundImgs &&
      setCurrentMenuBackground({
        url: settings.menuBackgroundImgs[0],
        index: 0,
      });
  }, [settings]);

  const onSubmit = data => {
    if (submitNow) {
      setIsMessage(true);
      if (backgroundPicture.length === 1) {
        data.backgroundImg = backgroundPicture[0];
      } else {
        data.backgroundImg = settings.backgroundImg;
      }
      if (menuBackgroundPicture.length === 1) {
        data.menuBackgroundImg = menuBackgroundPicture[0];
      } else {
        data.menuBackgroundImg = currentMenuBackground.url;
      }
      if (removedMenuBackground) {
        data.removedMenuBackground = removedMenuBackground.url;
        data.removedCloudinaryMenuBackgroundId =
          settings.cloudinaryMenuBackgroundImgIds[removedMenuBackground.index];
      }
      data.cloudinaryBackgroundImgId = settings.cloudinaryBackgroundImgId;
      data.cloudinaryMenuBackgroundImgId =
        settings.cloudinaryMenuBackgroundImgIds[currentMenuBackground.index];
      if (data.backgroundImg) {
        updateSettings(data, token);
        console.log(data);
      }
    }
  };

  const deleteMenuBackground = (url, i) => {
    setRemovedMenuBackground(el =>
      el && el.url === url ? null : { url, index: i }
    );
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
              defaultValue={settings.nrOfPromos}
              className='settings-input settings-hover'
              onChange={e => setNewNrOfPromos(e.target.value)}
              ref={register({
                required: true,
              })}
            />
          </label>
          <div className='settings-label'>
            Lista sačuvanih menu-backgroud-ova:
            <div className='settings-old-menu-backgrounds-container'>
              {settings.menuBackgroundImgs &&
                settings.menuBackgroundImgs.length === 0 && (
                  <div className='settings-menu-background-info'>
                    Još ne postoji ni jedna menu background slika!
                  </div>
                )}
              {settings.menuBackgroundImgs &&
                settings.menuBackgroundImgs.map((url, i) => (
                  <div
                    key={i}
                    className='settings-old-menu-backgrounds-element'
                  >
                    <Image
                      src={url}
                      alt='old background'
                      className='settings-old-menu-pic'
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                    <button
                      onClick={() =>
                        setCurrentMenuBackground({ url: url, index: i })
                      }
                      disabled={
                        currentMenuBackground &&
                        currentMenuBackground.url === url
                      }
                      className={`settings-apply-background-button ${
                        currentMenuBackground &&
                        currentMenuBackground.url === url
                          ? 'settings-selected-background-button'
                          : null
                      }`}
                    >
                      {currentMenuBackground &&
                      currentMenuBackground.url === url ? (
                        <span>&#10004;</span>
                      ) : (
                        'Postavi'
                      )}
                    </button>
                    <button
                      onClick={() => deleteMenuBackground(url, i)}
                      className={`red-button settings-delete-menu-background-button ${
                        removedMenuBackground &&
                        removedMenuBackground.url === url
                          ? 'settings-selected-to-delete-background-button'
                          : null
                      }`}
                    >
                      {removedMenuBackground &&
                      removedMenuBackground.url === url ? (
                        <span>&#10008;</span>
                      ) : (
                        'Obriši'
                      )}
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <label className='new-promo-label'>
            Novi Menu Background:
            <ImageUploader
              setMenuBackgroundPicture={setMenuBackgroundPicture}
              name='menuBackgroundImg'
              register={register}
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
          <label className='new-promo-label'>
            Novi Background:
            <ImageUploader
              setBackgroundPicture={setBackgroundPicture}
              name='backgroundImg'
              register={register}
            />
          </label>
          <button
            // disabled={!formState.isDirty || !formState.isValid}
            disabled={
              newNrOfPromos &&
              (newNrOfPromos > promosList.length || newNrOfPromos < 1)
                ? true
                : false
            }
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
