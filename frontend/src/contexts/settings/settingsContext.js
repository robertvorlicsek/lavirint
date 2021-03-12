import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { settingsReducer, settingsInitialState } from './settingsReducer';
import { useHistory } from 'react-router-dom';
const SettingsContext = createContext();
export const useSettingsContext = () => useContext(SettingsContext);

// Comics context for the provider
export const SettingsProvider = ({ children }) => {
  const activeHttpRequests = useRef([]);
  const [state, dispatch] = useReducer(settingsReducer, settingsInitialState);
  const history = useHistory();

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  useEffect(() => {
    let disableIntroTimer = setTimeout(() => {
      sessionStorage.setItem(
        'intro',
        JSON.stringify({
          disableIntro: true,
        })
      );
    }, 2000);
    return () => clearTimeout(disableIntroTimer);
  }, []);

  const getSettings = useCallback(async () => {
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);
    try {
      const response = await fetch('http://localhost:5000/api/settings');
      const data = await response.json();
      activeHttpRequests.current = activeHttpRequests.current.filter(
        reqCtrl => reqCtrl !== httpAbortCtrl
      );
      dispatch({ type: 'GET', payload: data });
    } catch (err) {
      console.log(err.message);
      dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
    }
  }, []);

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  const updateSettings = (newEntry, token) => {
    console.log(
      '🚀 ~ file: promoContext.js ~ line 45 ~ PromoProvider ~ newEntry',
      newEntry
    );
    if (newEntry) {
      const formData = new FormData();
      formData.append('nrOfPromos', newEntry.nrOfPromos);
      formData.append(
        'cloudinaryBackgroundImgId',
        newEntry.cloudinaryBackgroundImgId
      );
      if (newEntry.backgroundImg.file) {
        formData.append('backgroundImg', newEntry.backgroundImg.file);
      } else {
        formData.append('backgroundImg', newEntry.backgroundImg);
      }

      const image = formData.get('backgroundImg');

      console.log(image);

      const sendSettings = async () => {
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
          const response = await fetch(`http://localhost:5000/api/settings`, {
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

          console.log(`Podešavanja su uspešno promenjena!`);

          dispatch({
            type: 'MESSAGE',
            payload: responseData.message,
          });

          dispatch({ type: 'UPDATE', payload: newEntry });
          getSettings();
          history.push(`/promo`);
        } catch (err) {
          dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
          console.log(err);
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
  //     const response = await fetch(`http://localhost:5000/api/promo/${id}`, {
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
  //     console.log(err);
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
        //   addPromo,
        //   setPromoAsFirst,
        //   deletePromo,
        //   promosList: state.promosList,
        errorMessage: state.errorMessage,
        message: state.message,
        emptyMessages,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
