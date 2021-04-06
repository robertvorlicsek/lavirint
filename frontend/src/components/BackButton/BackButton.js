import './BackButton.css';

const BackButton = () => {
  return (
    <div className='back-button-container'>
      <button className='back-button' onClick={() => window.history.back()}>
        &#8592;&nbsp;nazad&nbsp;
      </button>
    </div>
  );
};

export default BackButton;
