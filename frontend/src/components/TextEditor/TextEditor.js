import { useState } from 'react';
import parse from 'html-react-parser';
import './TextEditor.css';

const TextEditor = ({ className, register }) => {
  const [mainTitle, setMainTitle] = useState('');
  const [mainText, setMainText] = useState('');
  return (
    <div className='text-editor-container'>
      <label for='text-editor-title'>
        Promo naslov ide ovde. Za menjanje boja i stila pogledaj u opisu
        sledećeg polja.
      </label>
      <textarea
        id='text-editor-title'
        register={register({
          required: true,
        })}
        className={className}
        onChange={e => setMainTitle(e.target.value)}
        name='promoTitle'
        rows='1'
        cols='30'
      ></textarea>
      <label for='text-editor-text'>
        Promo tekst ide ovde. Ako hoćeš da menjaš boju ili bili šta drugo, stavi
        željeno slovo(a), reč(i) ili rečenicu/e između {'(<span></span>)'} taga.
        Primer: <br />
        {`Gospođa <span style="color: red; font-size:2rem;">prima</span> utorkom i petkom`}
        . <br />
        Ako iskopiraš primer selektivne gospođe tu dole, videćeš na šta mislim.
        Šta sve možeš da staviš u "style", izguglaj pod "css styles".
      </label>
      <textarea
        className={className}
        id='text-editor-text'
        register={register({
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
    </div>
  );
};

export default TextEditor;
