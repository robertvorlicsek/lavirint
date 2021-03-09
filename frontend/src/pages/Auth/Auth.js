import { useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../contexts/auth/authContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import './Auth.css';

const Auth = () => {
  const {
    register,
    handleSubmit,
    formState,
    // watch, errors
  } = useForm({
    mode: 'onChange',
  });
  const { signup, token, logout, message, errorMessage } = useAuthContext();
  const [isMessage, setIsMessage] = useState(false);

  const onSubmit = data => {
    setIsMessage(true);
    console.log(data);
    signup(data);
  };

  const userLogout = () => {
    logout();
  };

  return (
    <Fragment>
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}
      <div className='auth-container'>
        {token ? (
          <button onClick={userLogout}>Logout</button>
        ) : (
          <Fragment>
            <form className='new-promo-form' onSubmit={handleSubmit(onSubmit)}>
              <input
                type='text'
                name='username'
                className='login-input login-hover'
                ref={register({
                  required: true,
                })}
              />
              <input
                type='text'
                name='password'
                className='login-input login-hover'
                ref={register({
                  required: true,
                })}
              />

              <button
                disabled={!formState.isDirty || !formState.isValid}
                // disabled={
                //   !formState.isValid ||
                //   formState.isSubmitting
                // }
                type='submit'
                value='Submit'
                className='login-submit'
              >
                Submit
              </button>
            </form>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default Auth;
