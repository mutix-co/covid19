import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';

export default function QRCodeBox(props) {
  const canvas = useRef();
  const { url, className } = props;

  useEffect(() => {
    QRCode.toCanvas(canvas.current, url, { errorCorrectionLevel: 'H' });
  }, [url]);

  return (
    <div className={className}>
      <canvas ref={canvas} />
    </div>
  );
}

QRCodeBox.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
};

QRCodeBox.defaultProps = {
  className: '',
};
