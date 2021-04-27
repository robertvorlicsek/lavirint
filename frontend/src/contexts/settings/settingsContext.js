import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { settingsReducer, settingsInitialState } from './settingsReducer';
import { useHistory, useLocation } from 'react-router-dom';
const SettingsContext = createContext();
export const useSettingsContext = () => useContext(SettingsContext);

// Comics context for the provider
export const SettingsProvider = ({ children }) => {
  const activeHttpRequests = useRef([]);
  const [state, dispatch] = useReducer(settingsReducer, settingsInitialState);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  const getSettings = useCallback(async () => {
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);
    try {
      const response = await fetch(`/api/settings`);
      const data = await response.json();
      activeHttpRequests.current = activeHttpRequests.current.filter(
        reqCtrl => reqCtrl !== httpAbortCtrl
      );
      dispatch({ type: 'GET', payload: data });
    } catch (err) {
      dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
    }
  }, []);

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
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
          const response = await fetch(`/api/settings`, {
            method: 'PATCH',
            body: formData,
            headers: { Authorization: 'Bearer ' + token },
            signal: httpAbortCtrl.signal,
          });
          const responseData = await response.json();

          activeHttpRequests.current = activeHttpRequests.current.filter(
            reqCtrl => reqCtrl !== httpAbortCtrl
          );

          if (!response.ok) {
            throw new Error(responseData.message);
          }

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

  // const setPromoAsFirst = useCallback(id => {
  //   dispatch({ type: 'SET_FIRST', payload: id });
  // }, []);

  // const deletePromo = async id => {
  //   const httpAbortCtrl = new AbortController();
  //   activeHttpRequests.current.push(httpAbortCtrl);
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/promo/${id}`, {
  //       method: 'DELETE',
  //       body: null,
  //       signal: httpAbortCtrl.signal,
  //     });
  //     const resMessage = await response.json();

  //     activeHttpRequests.current = activeHttpRequests.current.filter(
  //       reqCtrl => reqCtrl !== httpAbortCtrl
  //     );

  //     if (!response.ok) {
  //       throw new Error(resMessage.message);
  //     }

  //     dispatch({ type: 'MESSAGE', payload: resMessage.message });
  //   } catch (err) {
  //     dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
  //   }
  //   dispatch({ type: 'REMOVE', payload: id });
  // };

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
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
