import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import { settingsReducer, settingsInitialState } from './settingsReducer';
import { useHistory, useLocation } from 'react-router-dom';
const SettingsContext = createContext();
export const useSettingsContext = () => useContext(SettingsContext);

// Comics context for the provider
export const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, settingsInitialState);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const location = useLocation();

  const getSettings = useCallback(async () => {
    try {
      const responseData = await sendRequest(`/api/settings`);
      dispatch({ type: 'GET', payload: responseData });
    } catch (err) {
      dispatch({ type: 'ERROR_MESSAGE', payload: error });
    }
  }, [sendRequest, error]);

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  const disableIntro = useCallback(value => {
    dispatch({ type: 'DISABLE_INTRO', payload: value });
  }, []);

  useEffect(() => {
    const intro = JSON.parse(sessionStorage.getItem('intro'));
    if (!!intro) {
      disableIntro(intro.disableIntro);
    }
    if (location.pathname !== '/') {
      disableIntro(true);
    }
    let disableIntroTimer = setTimeout(() => {
      sessionStorage.setItem(
        'intro',
        JSON.stringify({
          disableIntro: true,
        })
      );
    }, 10000);

    return () => clearTimeout(disableIntroTimer);
  }, [disableIntro, getSettings, location]);

  const updateSettings = (newEntry, token) => {
    if (newEntry) {
      const formData = new FormData();
      formData.append('nrOfPromos', newEntry.nrOfPromos);
      formData.append(
        'cloudinaryBackgroundImgId',
        newEntry.cloudinaryBackgroundImgId
      );
      formData.append(
        'cloudinaryMenuBackgroundImgId',
        newEntry.cloudinaryMenuBackgroundImgId
      );
      formData.append('textColor', JSON.stringify(newEntry.textColor));
      formData.append(
        'backgroundColor',
        JSON.stringify(newEntry.backgroundColor)
      );
      if (newEntry.backgroundImg.file) {
        formData.append('backgroundImg', newEntry.backgroundImg.file);
      } else {
        formData.append('backgroundImg', newEntry.backgroundImg);
      }
      if (newEntry.menuBackgroundImg.file) {
        formData.append('menuBackgroundImg', newEntry.menuBackgroundImg.file);
      } else {
        formData.append('menuBackgroundImg', newEntry.menuBackgroundImg);
      }
      if (newEntry.removedBackground) {
        formData.append('removedBackground', newEntry.removedBackground);
        formData.append(
          'removedCloudinaryBackgroundId',
          newEntry.removedCloudinaryBackgroundId
        );
      }
      if (newEntry.removedMenuBackground) {
        formData.append(
          'removedMenuBackground',
          newEntry.removedMenuBackground
        );
        formData.append(
          'removedCloudinaryMenuBackgroundId',
          newEntry.removedCloudinaryMenuBackgroundId
        );
      }

      const sendSettings = async () => {
        try {
          const responseData = await sendRequest(
            `/api/settings`,
            'PATCH',
            formData,
            {
              Authorization: 'Bearer ' + token,
            }
          );

          dispatch({
            type: 'MESSAGE',
            payload: responseData.message,
          });

          dispatch({ type: 'UPDATE', payload: newEntry });
          getSettings();
          history.push(`/`);
        } catch (err) {
          dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
        }
      };
      sendSettings();
    }
  };

  const emptyMessages = useCallback(
    () => dispatch({ type: 'EMPTY_MESSAGES' }),
    []
  );

  return (
    <SettingsContext.Provider
      value={{
        getSettings,
        updateSettings,
        settings: state.settings,
        nrOfPromos: state.nrOfPromos,
        introDisabled: state.introDisabled,
        errorMessage: state.errorMessage,
        message: state.message,
        emptyMessages,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
