import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { promosReducer, promosInitialState } from './promosReducer';
import { useHistory } from 'react-router-dom';
const PromosContext = createContext();
export const usePromosContext = () => useContext(PromosContext);

// Comics context for the provider
export const PromosProvider = ({ children }) => {
  const activeHttpRequests = useRef([]);
  const [state, dispatch] = useReducer(promosReducer, promosInitialState);
  const history = useHistory();

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  const getPromos = useCallback(async () => {
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);
    try {
      const response = await fetch('http://localhost:5000/api/promo');
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

  const addPromo = newEntry => {
    console.log(
      '🚀 ~ file: promoContext.js ~ line 45 ~ PromoProvider ~ newEntry',
      newEntry
    );
    if (newEntry) {
      const formData = new FormData();
      formData.append('promoName', newEntry.promoName);
      formData.append('nr', newEntry.nr);
      formData.append('promoTitle', newEntry.promoTitle);
      formData.append('promoText', newEntry.promoText);
      if (newEntry.promoImg) {
        formData.append('promoImg', newEntry.promoImg.file);
      }

      const image = formData.get('promoImg');

      console.log(image);

      const sendPromo = async () => {
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
          const response = await fetch(
            `http://localhost:5000/api/promo/newpromo`,
            {
              method: 'POST',
              body: formData,
              signal: httpAbortCtrl.signal,
            }
          );
          const responseData = await response.json();

          activeHttpRequests.current = activeHttpRequests.current.filter(
            reqCtrl => reqCtrl !== httpAbortCtrl
          );

          if (!response.ok) {
            throw new Error(responseData.message);
          }

          console.log(`Najava je uspešno postavljena!`);

          dispatch({
            type: 'MESSAGE',
            payload: responseData.message,
          });

          dispatch({ type: 'ADD', payload: newEntry });
          history.push(`/promo`);
        } catch (err) {
          dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
          console.log(err);
        }
      };
      sendPromo();
    }
  };

  const deletePromo = async id => {
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);
    try {
      const response = await fetch(`http://localhost:5000/api/promo/${id}`, {
        method: 'DELETE',
        body: null,
        signal: httpAbortCtrl.signal,
      });
      const resMessage = await response.json();

      activeHttpRequests.current = activeHttpRequests.current.filter(
        reqCtrl => reqCtrl !== httpAbortCtrl
      );

      if (!response.ok) {
        throw new Error(resMessage.message);
      }

      dispatch({ type: 'MESSAGE', payload: resMessage.message });
    } catch (err) {
      dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
      console.log(err);
    }
    dispatch({ type: 'REMOVE', payload: id });
  };

  const emptyMessages = useCallback(
    () => dispatch({ type: 'EMPTY_MESSAGES' }),
    []
  );

  return (
    <PromosContext.Provider
      value={{
        getPromos,
        addPromo,
        deletePromo,
        promosList: state.promosList,
        errorMessage: state.errorMessage,
        message: state.message,
        emptyMessages,
      }}
    >
      {children}
    </PromosContext.Provider>
  );
};
