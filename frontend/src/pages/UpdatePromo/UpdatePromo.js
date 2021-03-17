import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import parse from 'html-react-parser';
import { useAuthContext } from '../../contexts/auth/authContext';
import { usePromosContext } from '../../contexts/promos/promosContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import ImageUploader from '../../components/ImageUploader/ImageUploader';
import Image from '../../components/Image/Image';
import './UpdatePromo.css';

const currentDate = input => {
  const msDate = Date.parse(input);
  const date = new Date(msDate);
  return `${date.getFullYear()}-${
    date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDay() < 10 ? '0' + date.getDay() : date.getDay() + 1}`;
};

const UpdatePromo = () => {
  let { id } = useParams();
  const {
    register,
    handleSubmit,
    formState,
    // watch, errors
  } = useForm({
    mode: 'onChange',
  });
  const { updatePromo, message, errorMessage, promosList } = usePromosContext();
  const { token } = useAuthContext();
  const [takenNr, setTakenNr] = useState('');
  const [editItem, setEditItem] = useState('');
  const [notAvailableNr, setNotAvailableNr] = useState(false);
  const [promoPicture, setPromoPicture] = useState([]);
  const [todaysDate, setTodaysDate] = useState(null);
  const [mainTitle, setMainTitle] = useState('');
  const [mainText, setMainText] = useState('');
  const [isMessage, setIsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(true);

  const onSubmit = data => {
    if (!disableSubmit) {
      setIsMessage(true);
      if (promoPicture[0]) {
        data.promoImg = promoPicture[0];
      } else {
        data.promoImg = editItem.promoImg;
      }
      data.id = editItem.id;
      data.cloudinaryPromoImgId = editItem.cloudinaryPromoImgId;
      if (data.promoImg) {
        updatePromo(data, token);
      }
    }
  };

  const checkAvailability = e => {
    setNotAvailableNr(
      Array.from(takenNr).includes(e.target.value) &&
        editItem.nr.toString() !== e.target.value
    );
  };

  // useEffect(() => {
  //   console.log('touched', formState.touched);
  //   console.log('pic', promoPicture);
  // }, [formState, promoPicture]);

  useEffect(() => {
    const eItem = promosList.find(p => p.id === id);
    setEditItem(eItem);
  }, [id, promosList]);

  useEffect(() => {
    if (promosList) {
      const taken = promosList
        .map(p => p.nr)
        .filter(p => p !== editItem.nr)
        .toString();
      setTakenNr(taken);
    }
  }, [promosList, editItem]);

  //   useEffect(() => {
  //       if()
  //    setMainTitle()
  //   }, [promosList]);

  console.log('NAN:', notAvailableNr);

  return (
    <Fragment>
      {isMessage && (
        <LoadingOverlay message={message} errorMessage={errorMessage} />
      )}
      <div
        className='update-promo-container opacity'
        style={!isLoading ? { opacity: '1' } : { opacity: '0' }}
      >
        <h1 className='update-promo-title'>Edit najave</h1>
        <form className='update-promo-form' onSubmit={handleSubmit(onSubmit)}>
          <label className='update-promo-label'>
            Novi broj najave (zbog redosleda na glavnoj strani, animacija kreće
            od najvećeg broja).
            <br />
            <span className='red-warning-text'>
              {promosList && `Već zauzeti brojevi: ${takenNr}`}
            </span>
            <input
              defaultValue={editItem.nr}
              type='number'
              name='nr'
              onChange={e => checkAvailability(e)}
              className='update-promo-input promo-form-hover'
              ref={register({
                required: true,
              })}
            />
          </label>
          {notAvailableNr && (
            <p className='red-warning-text'>Ovaj broj je već zauzet!</p>
          )}
          <label className='update-promo-label'>
            Novi datum:
            <input
              onChange={e => setTodaysDate(e.target.value)}
              type='date'
              name='promoDate'
              value={todaysDate || currentDate(editItem.promoDate)}
              className='update-promo-input promo-form-hover'
              ref={register({
                required: true,
              })}
            />
          </label>
          <label className='settings-label'>
            Stara promo slika:
            <Image
              src={editItem.promoImg}
              alt='old background'
              className='old-promo-pic'
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </label>
          <label className='update-promo-label'>
            Nova promo slika:
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
            defaultValue={editItem.promoTitle}
            name='promoTitle'
            rows='1'
            cols='30'
          ></textarea>
          <label htmlFor='text-editor-text'>
            Novi promo tekst ide ovde. Ako hoćeš da menjaš boju ili bilo šta
            drugo, stavi željeno/a slovo/a, reč(i) ili rečenicu/e između{' '}
            {'(<span></span>)'} taga.
            <br />
            Tekst koji će se pojaviti na najavi prve strane odvoji sa{' '}
            <span style={{ color: 'yellow' }}>-do ovde!-</span>&nbsp;. <br />
            Ostatak posle toga će se pojaviti samo u "vestima".
          </label>
          <textarea
            defaultValue={editItem.promoText}
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
              <br /> {parse(mainTitle) || parse(editItem.promoTitle)}
            </div>
            <div className='text-editor-preview-text-output'>
              <br /> {parse(mainText) || parse(editItem.promoText)}
            </div>
          </div>
          <button
            // disabled={!formState.isDirty || !formState.isValid}
            disabled={formState.isSubmitting || notAvailableNr}
            type='submit'
            value='Submit'
            className='update-promo-submit'
            onClick={() => setDisableSubmit(false)}
          >
            Submit
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default UpdatePromo;
