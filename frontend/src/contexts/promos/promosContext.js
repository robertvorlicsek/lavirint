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
      const response = await fetch(`/api`);
      const data = await response.json();
      activeHttpRequests.current = activeHttpRequests.current.filter(
        reqCtrl => reqCtrl !== httpAbortCtrl
      );
      dispatch({ type: 'GET', payload: data });
    } catch (err) {
      dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
    }
  }, []);

  const addPromo = (newEntry, token) => {
    if (newEntry) {
      const formData = new FormData();
      formData.append('nr', newEntry.nr);
      formData.append('promoDate', newEntry.promoDate);
      formData.append('promoTitle', newEntry.promoTitle);
      formData.append('promoText', newEntry.promoText);
      if (newEntry.promoImg) {
        formData.append('promoImg', newEntry.promoImg.file);
      }

      const sendPromo = async () => {
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
          const response = await fetch(`/api/newpromo`, {
            method: 'POST',
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

          dispatch({ type: 'ADD', payload: newEntry });
          history.push(`/`);
        } catch (err) {
          dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
        }
      };
      sendPromo();
    }
  };
  const updatePromo = (modifiedEntry, token) => {
    if (modifiedEntry) {
      const formData = new FormData();
      formData.append('nr', modifiedEntry.nr);
      formData.append('promoDate', modifiedEntry.promoDate);
      formData.append('promoTitle', modifiedEntry.promoTitle);
      formData.append('promoText', modifiedEntry.promoText);
      formData.append(
        'cloudinaryPromoImgId',
        modifiedEntry.cloudinaryPromoImgId
      );
      if (modifiedEntry.promoImg.file) {
        formData.append('promoImg', modifiedEntry.promoImg.file);
      } else if (!modifiedEntry.promoImg.file) {
        formData.append('promoImg', modifiedEntry.promoImg);
      }

      const sendPromo = async () => {
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
          const response = await fetch(`/api/${modifiedEntry.id}`, {
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

          dispatch({ type: 'UPDATE', payload: modifiedEntry });
          history.push(`/`);
        } catch (err) {
          dispatch({ type: 'ERROR_MESSAGE', payload: err.message });
        }
      };
      sendPromo();
    }
  };

  const setPromoAsFirst = useCallback(id => {
    dispatch({ type: 'SET_FIRST', payload: id });
  }, []);

  const deletePromo = async (id, token) => {
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);
    try {
      const response = await fetch(`/api/${id}`, {
        method: 'DELETE',
        body: null,
        headers: { Authorization: 'Bearer ' + token },
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
        setPromoAsFirst,
        updatePromo,
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
