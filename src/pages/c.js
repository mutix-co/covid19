import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import html2canvas from 'html2canvas';
import QRCodeBox from '../components/QRCodeBox';
import Note from '../components/Note';
import styles from './c.module.css';

const Title = styled.div`
  width: 100%;
  font-size: 1.2em;
  text-align: center;
  margin: 4px;
`;

const QRCode = styled(QRCodeBox)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InfoBox = styled.div`
  display: flex;
  margin: 0 auto;
  width: 240px;
  align-items: flex-end;
`;

const Icon = styled.div`
  background-image: url(${({ src }) => src});
  background-position: center;
  background-size: cover;
  width: 128px;
  height: 64px;
`;

const CenterNote = styled(Note)`
  text-align: center;
`;

export default function Check() {
  const router = useRouter();
  const wrapper = React.useRef();
  const [timestamp, setTimestamp] = useState(0);
  const [url, setUrl] = useState('null');
  const { id, t: title } = router.query;

  useEffect(() => {
    if (!id) return;

    if (/^[a-f0-9]{32}$/.test(id) === false) {
      router.push('/');
      return;
    }

    (async () => {
      try {
        const res = await axios.get(`/api/signature/${id}`);
        setUrl(`${location.origin}/c?id=${id}&t=${title}`);
        setTimestamp(res.data.timestamp);
      } catch (err) {
        setTimestamp(false);
      }
    })();
  }, [id, title]);

  const onScreenshot = async () => {
    const canvas = await html2canvas(wrapper.current);
    const download = document.createElement('a');
    download.download = 'covid19.png';
    download.href = canvas.toDataURL('image/jpeg');
    download.click();
  };

  return (
    <div ref={wrapper}>
      {title && <Title>{title}</Title>}
      <InfoBox>
        <Icon src="/images/check.png" />
        <div>
          <Note>實聯制登錄完成</Note>
          <Note>{DateTime.fromSeconds(timestamp).toLocaleString(DateTime.DATE_FULL)}</Note>
          <Note>{DateTime.fromSeconds(timestamp).toLocaleString(DateTime.TIME_SIMPLE)}</Note>
        </div>
      </InfoBox>
      <QRCode url={url} />
      <CenterNote>{id}</CenterNote>
      <div className={styles.toolbar}>
        <button type="button" className={styles.screenshot} onClick={onScreenshot}>
          請出示此畫面截圖
        </button>
      </div>
    </div>
  );
}
