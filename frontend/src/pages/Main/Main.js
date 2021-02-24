import zero from '../../pic/zero.jpg';
import './Main.css';

const Main = () => {
  return (
    <div className='main-page'>
      <div className='main-promo-item'>
        <img src={zero} alt='Main Pic' className='main-promo-pic' />
        <div className='main-promo-text-container'>
          <div className='main-promo-title'>
            LAVIRINT PODVALJUJE: Nula (Jedan, Dva...)
          </div>
          <div className='main-promo-text'>
            Standardni mix neuroze i nervoze od Vaše omiljene stripske znamenke
            (nakon Broja 1, naravno), u prodaji po ponekim domaćim striparnicama
            (BG, ZG, NS i KG za sada oprskbljeni) i ni u jednoj redovnoj
            knjigari ('Bulevar Books je striparnica!' forevr!). 216 strana, B5,
            cb+kolor, meki povez, 1200din/80kn. Ovaj put u tvrdom povezu i sa
            dodatnih 12 strana (materijal iz dopunjenog italijanskog izdanja, iz
            2017.). 152 strane, B5, cb+kolor, tvrdi povez, 600din/50kn.
          </div>
        </div>
        <div className='main-promo-text-container-filler'>
          &nbsp;
          <br />
          &nbsp;
        </div>
      </div>
    </div>
  );
};

export default Main;
