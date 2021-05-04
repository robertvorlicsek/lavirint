import { createContext, useContext, useReducer, useCallback } from 'react';
import { promosReducer, promosInitialState } from './promosReducer';
import { useHttpClient } from '../../hooks/http-hook';

import { useHistory } from 'react-router-dom';
const PromosContext = createContext();
export const usePromosContext = () => useContext(PromosContext);

// Comics context for the provider
export const PromosProvider = ({ children }) => {
  const [state, dispatch] = useReducer(promosReducer, promosInitialState);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const getPromos = useCallback(async () => {
    try {
      const responseData = await sendRequest(`/api`);

      dispatch({ type: 'GET', payload: responseData });
    } catch (err) {
      dispatch({ type: 'ERROR_MESSAGE', payload: error });
    }
  }, [sendRequest, error]);

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
        try {
          const responseData = await sendRequest(
            `/api/newpromo`,
            'POST',
            formData,
            {
              Authorization: 'Bearer ' + token,
            }
          );

          dispatch({
            type: 'MESSAGE',
            payload: responseData.message,
          });

          dispatch({ type: 'ADD', payload: newEntry });
          history.push(`/`);
        } catch (err) {
          dispatch({ type: 'ERROR_MESSAGE', payload: error });
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
        try {
          const responseData = await sendRequest(
            `/api/${modifiedEntry.id}`,
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

          dispatch({ type: 'UPDATE', payload: modifiedEntry });
          history.push(`/`);
        } catch (err) {
          dispatch({ type: 'ERROR_MESSAGE', payload: error });
        }
      };
      sendPromo();
    }
  };

  const setPromoAsFirst = useCallback(id => {
    dispatch({ type: 'SET_FIRST', payload: id });
  }, []);

  const deletePromo = async (id, token) => {
    try {
      const responseData = await sendRequest(`/api/${id}`, 'DELETE', null, {
        Authorization: 'Bearer ' + token,
      });

      dispatch({ type: 'MESSAGE', payload: responseData.message });
    } catch (err) {
      dispatch({ type: 'ERROR_MESSAGE', payload: error });
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
