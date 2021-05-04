import { Fragment } from 'react';

const Image = ({ src, alt, className, setIsPicLoading, onClick, style }) => {
  return (
    <Fragment>
      <img
        onLoad={() => setIsPicLoading(false)}
        src={src}
        alt={alt}
        className={className}
        onClick={onClick}
        style={style}
      />
    </Fragment>
  );
};

export default Image;
