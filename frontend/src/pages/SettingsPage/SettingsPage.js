import { useState, useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import ColorPicker from '../../components/ColorPicker/ColorPicker';
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
  const [removedBackground, setRemovedBackground] = useState(null);
  const [menuBackgroundPicture, setMenuBackgroundPicture] = useState([]);
  const [removedMenuBackground, setRemovedMenuBackground] = useState(null);
  const [newNrOfPromos, setNewNrOfPromos] = useState('');
  const [currentBackground, setCurrentBackground] = useState(null);
  const [currentMenuBackground, setCurrentMenuBackground] = useState(null);
  const [isMessage, setIsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitNow, setSubmitNow] = useState(false);
  const [textColor, setTextColor] = useState({
    r: '255',
    g: '255',
    b: '255',
    a: '1',
  });
  const [backgroundColor, setBackgroundColor] = useState({
    r: '255',
    g: '255',
    b: '255',
    a: '0.3',
  });

  useEffect(() => {
    getPromos();
  }, [getPromos]);

  useEffect(() => {
    settings.backgroundImgs &&
      setCurrentBackground({
        url: settings.backgroundImgs[0],
        index: 0,
      });
    settings.menuBackgroundImgs &&
      setCurrentMenuBackground({
        url: settings.menuBackgroundImgs[0],
        index: 0,
      });
    settings.textColor && setTextColor(settings.textColor);
    settings.backgroundColor && setBackgroundColor(settings.backgroundColor);
  }, [settings]);

  const onSubmit = data => {
    if (submitNow) {
      setIsMessage(true);
      if (backgroundPicture.length === 1) {
        data.backgroundImg = backgroundPicture[0];
      } else {
        data.backgroundImg = currentBackground.url;
      }
      if (menuBackgroundPicture.length === 1) {
        data.menuBackgroundImg = menuBackgroundPicture[0];
      } else {
        data.menuBackgroundImg = currentMenuBackground.url;
      }
      if (removedBackground) {
        data.removedBackground = removedBackground.url;
        data.removedCloudinaryBackgroundId =
          settings.cloudinaryBackgroundImgIds[removedBackground.index];
      }
      if (removedMenuBackground) {
        data.removedMenuBackground = removedMenuBackground.url;
        data.removedCloudinaryMenuBackgroundId =
          settings.cloudinaryMenuBackgroundImgIds[removedMenuBackground.index];
      }
      data.cloudinaryBackgroundImgId =
        settings.cloudinaryBackgroundImgIds[currentBackground.index];
      data.cloudinaryMenuBackgroundImgId =
        settings.cloudinaryMenuBackgroundImgIds[currentMenuBackground.index];
      data.textColor = textColor;
      data.backgroundColor = backgroundColor;
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
  const deleteBackground = (url, i) => {
    setRemovedBackground(el =>
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
          <label className='settings-label'>
            Broj najava vidljivih na prvoj strani:
            <br />
            <span className='red-warning-text'>
              Broj mora da bude manji od{' '}
              <span className='red-warning-text'>{promosList.length + 1}</span>
            </span>
            <input
              type='number'
              name='nrOfPromos'
              defaultValue={
                settings.nrOfPromos > promosList.length
                  ? promosList.length
                  : settings.nrOfPromos
              }
              className='settings-input settings-hover'
              onChange={e => setNewNrOfPromos(e.target.value)}
              ref={register({
                required: true,
              })}
            />
          </label>

          <div className='settings-color-container'>
            <label className='settings-label' style={{ textAlign: 'center' }}>
              Boja okvira najave:
              <ColorPicker
                color={backgroundColor}
                setColor={setBackgroundColor}
              />
            </label>
            <label className='settings-label' style={{ textAlign: 'center' }}>
              Boja teksta:
              <ColorPicker color={textColor} setColor={setTextColor} />
            </label>
          </div>

          <div className='settings-color-preview-container'>
            Preview okvira i teksta najave:
            <div
              className='settings-preview-frame-color'
              style={{
                background: `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`,
              }}
            >
              <p
                className='settings-preview-text-color'
                style={{
                  color: `rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, ${textColor.a})`,
                }}
              >
                Probni tekst
              </p>
            </div>
          </div>

          <div className='settings-label'>
            Lista sačuvanih menu-backgroud-ova:
            <div className='settings-old-backgrounds-container'>
              {settings.menuBackgroundImgs &&
                settings.menuBackgroundImgs.length === 0 && (
                  <div className='settings-background-info'>
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
                      alt='old menu background'
                      className='settings-old-pic'
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
                      className={`red-button settings-delete-background-button ${
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
            Novi Menu Background (300px širine):
            <ImageUploader
              setMenuBackgroundPicture={setMenuBackgroundPicture}
              name='menuBackgroundImg'
              register={register}
            />
          </label>

          <div className='settings-label'>
            Lista sačuvanih backgroud-ova:
            <div className='settings-old-backgrounds-container'>
              {settings.backgroundImgs &&
                settings.backgroundImgs.length === 0 && (
                  <div className='settings-background-info'>
                    Još ne postoji ni jedna menu background slika!
                  </div>
                )}
              {settings.backgroundImgs &&
                settings.backgroundImgs.map((url, i) => (
                  <div key={i} className='settings-old-backgrounds-element'>
                    <Image
                      src={url}
                      alt='old background'
                      className='settings-old-pic'
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                    <button
                      onClick={() =>
                        setCurrentBackground({ url: url, index: i })
                      }
                      disabled={
                        currentBackground && currentBackground.url === url
                      }
                      className={`settings-apply-background-button ${
                        currentBackground && currentBackground.url === url
                          ? 'settings-selected-background-button'
                          : null
                      }`}
                    >
                      {currentBackground && currentBackground.url === url ? (
                        <span>&#10004;</span>
                      ) : (
                        'Postavi'
                      )}
                    </button>
                    <button
                      onClick={() => deleteBackground(url, i)}
                      className={`red-button settings-delete-background-button ${
                        removedBackground && removedBackground.url === url
                          ? 'settings-selected-to-delete-background-button'
                          : null
                      }`}
                    >
                      {removedBackground && removedBackground.url === url ? (
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
