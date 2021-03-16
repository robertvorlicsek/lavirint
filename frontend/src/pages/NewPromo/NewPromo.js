import { useState, useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import parse from 'html-react-parser';
import { useAuthContext } from '../../contexts/auth/authContext';
import { usePromosContext } from '../../contexts/promos/promosContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import ImageUploader from '../../components/ImageUploader/ImageUploader';
import './NewPromo.css';

const currentDate = () => {
  const currentTime = Date.now();
  console.log(
    '🚀 ~ file: NewPromo.js ~ line 12 ~ currentDate ~ currentTime',
    currentTime
  );
  const date = new Date(currentTime);
  return `${date.getFullYear()}-${
    date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDay() < 10 ? '0' + date.getDay() : date.getDay() + 1}`;
};

const NewPromo = () => {
  const {
    register,
    handleSubmit,
    formState,
    // watch, errors
  } = useForm({
    mode: 'onChange',
  });
  const { addPromo, message, errorMessage, promosList } = usePromosContext();
  const { token } = useAuthContext();
  const [takenNr, setTakenNr] = useState('');
  const [notAvailableNr, setNotAvailableNr] = useState(false);
  const [promoPicture, setPromoPicture] = useState([]);
  const [todaysDate, setTodaysDate] = useState(null);
  const [mainTitle, setMainTitle] = useState('');
  const [mainText, setMainText] = useState('');
  const [isMessage, setIsMessage] = useState(false);

  const onSubmit = data => {
    setIsMessage(true);
    data.promoImg = promoPicture[0];
    if (data.promoImg) {
      console.log(data);
      addPromo(data, token);
    }
  };

  const checkAvailability = e =>
    setNotAvailableNr(Array.from(takenNr).includes(e.target.value));

  // useEffect(() => {
  //   console.log('touched', formState.touched);
  //   console.log('pic', promoPicture);
  // }, [formState, promoPicture]);

  useEffect(() => {
    if (promosList) {
      const taken = promosList.map(p => p.nr).toString();
      setTakenNr(taken);
    }
  }, [promosList]);

  useEffect(() => {
    setTodaysDate(currentDate());
  }, [promosList]);

  return (
    <Fragment>
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}
      <div className='new-promo-container'>
        <h1 className='new-promo-title'>Upload nove najave</h1>
        <form className='new-promo-form' onSubmit={handleSubmit(onSubmit)}>
          <label className='new-promo-label'>
            Broj najave (zbog redosleda na glavnoj strani, animacija kreće od
            najvećeg broja).
            <br />
            <span className='red-warning-text'>
              {promosList && `Već zauzeti brojevi: ${takenNr}`}
            </span>
            <input
              type='number'
              name='nr'
              onChange={e => checkAvailability(e)}
              className='new-promo-input promo-form-hover'
              ref={register({
                required: true,
              })}
            />
          </label>
          {notAvailableNr && (
            <p className='red-warning-text'>Ovaj broj je već zauzet!</p>
          )}
          <label className='new-promo-label'>
            Datum:
            <input
              onChange={e => setTodaysDate(e.target.value)}
              type='date'
              name='promoDate'
              value={todaysDate || currentDate()}
              className='new-promo-input promo-form-hover'
              ref={register({
                required: true,
              })}
            />
          </label>
          <label className='new-promo-label'>
            Promo slika:
            <ImageUploader
              setPromoPicture={setPromoPicture}
              name='promoImg'
              register={register}
            />
          </label>
          {/* <TextEditor className='promo-form-hover' register={register} /> */}
          <label htmlFor='text-editor-title'>
            Promo naslov ide ovde. Za menjanje boja i stila pogledaj u opisu
            sledećeg polja.
          </label>
          <textarea
            id='text-editor-title'
            ref={register({
              required: true,
            })}
            className='promo-form-hover'
            onChange={e => setMainTitle(e.target.value)}
            name='promoTitle'
            rows='1'
            cols='30'
          ></textarea>
          <label htmlFor='text-editor-text'>
            Promo tekst ide ovde. Ako hoćeš da menjaš boju ili bilo šta drugo,
            stavi željeno/a slovo/a, reč(i) ili rečenicu/e između{' '}
            {'(<span></span>)'} taga.
            <br /> Primer:
            <br />
            <br />
            {`Gospođa <span style="color: red; font-size:2rem;">prima</span> utorkom i petkom`}
            . <br />
            <br />
            Ako iskopiraš primer selektivne gospođe tu dole, videćeš na šta
            mislim. Šta sve možeš da staviš u "style", izguglaj pod "css
            styles".
            <br /> <br />
            Tekst koji će se pojaviti na najavi prve strane odvoji sa{' '}
            <span style={{ color: 'yellow' }}>-do ovde!-</span>&nbsp;. <br />
            Ostatak posle toga će se pojaviti samo u "vestima".
          </label>
          <textarea
            className='promo-form-hover'
            id='text-editor-text'
            ref={register({
              required: true,
            })}
            onChange={e => setMainText(e.target.value)}
            name='promoText'
            rows='10'
            cols='30'
          ></textarea>
          <div className='text-editor-preview-output-container'>
            <p>Preview:</p>
            <div className='text-editor-preview-title-output'>
              <br /> {parse(mainTitle)}
            </div>
            <div className='text-editor-preview-text-output'>
              <br /> {parse(mainText)}
            </div>
          </div>
          <button
            // disabled={!formState.isDirty || !formState.isValid}
            disabled={
              !formState.isValid ||
              formState.isSubmitting ||
              promoPicture.length === 0 ||
              notAvailableNr
            }
            type='submit'
            value='Submit'
            className='new-promo-submit'
          >
            Submit
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default NewPromo;
