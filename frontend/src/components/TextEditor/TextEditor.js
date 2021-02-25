import { useEffect, useMemo, useState } from 'react';
// import { createEditor } from 'slate';
// import { Slate, Editor, withReact } from 'slate-react';

const TextEditor = () => {
  // const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]);
  return <div>test</div>;
  // (
  // <Slate
  //   editor={editor}
  //   value={value}
  //   onChange={newValue => setValue(newValue)}
  // >
  //   <Editor />
  // </Slate>
  // );
};

export default TextEditor;
