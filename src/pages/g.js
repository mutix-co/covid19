import React, {
  useCallback, useState, useEffect, useRef,
} from 'react';
import { codec, JSONWebSecretBox } from 'jw25519';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import QRCodeBox from '../components/QRCodeBox';
import Step from '../components/Step';
import Button from '../components/Button';
import ButtonBar from '../components/ButtonBar';
import Note from '../components/Note';
import Item from '../components/Item';
import Link from '../components/Link';

const Code = styled.textarea`
  width: 100%;
  background: transparent;
  border: none;
  resize: none;
  outline-width: 0;
`;

const Title = styled.div`
  width: 100%;
  font-size: 1.2em;
  text-align: center;
  margin: 4px;
`;

const CutLine = styled.div`
  border-top: 1px dashed #0e0e0e;
  font-size: 1em;
  text-align: center;
  margin-top: 30px;
  height: 30px;

  &::after {
    content: '✂ ✂ ✂';
    position: relative;
    top: -14px;
    background: #fafafa;
    padding: 0 5px;
  }
`;

const Url = styled(Link)`
  width: 100%;
  overflow-wrap: break-word;
`;

const QRCode = styled(QRCodeBox)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ScannerTip = styled(Note)`
  text-align: center;
`;

export default function Generator() {
  const router = useRouter();
  const code = useRef(null);
  const [keyPair, setKeyPair] = useState({ publicKey: '', secretKey: '' });
  const [url, setUrl] = useState('null');

  const { t: title } = router.query;

  useEffect(() => {
    const secretBox = new JSONWebSecretBox();
    const publicKey = codec.encode32(secretBox.keyPair.publicKey);
    const secretKey = codec.encode32(secretBox.keyPair.secretKey);
    setKeyPair({ publicKey, secretKey });
    setUrl(`${location.origin}/e?key=${publicKey}&t=${encodeURIComponent(title)}`);
  }, [title]);

  const onFocus = useCallback((e) => e.target.select(), []);
  const onCopy = useCallback(() => {
    code.current.focus();
    code.current.select();
    document.execCommand('copy');
  }, []);
  const onPrint = useCallback(() => window.print(), []);

  return (
    <div>
      <div>
        <Step>步驟 1: 妥善保存解密金鑰</Step>
        <Code
          ref={code}
          spellCheck={false}
          onFocus={onFocus}
          onChange={onFocus}
          value={keyPair.secretKey}
        />
        <ButtonBar>
          <Button type="button" onClick={onCopy}>複製</Button>
          <Button type="button" onClick={onPrint}>列印</Button>
        </ButtonBar>
      </div>
      <div>
        <Step>步驟 2: 張貼實聯制與二維碼</Step>
        <CutLine />
        <Title>{title}</Title>
        <div>「防疫新生活運動」個資保護服務</div>
        <Item>- 個資已使用 x25519-xsalsa20-poly1305 技術加密</Item>
        <Item>- 個資將於 28 日後自動完全情除</Item>
        <QRCode url={url} />
        <ScannerTip>掃碼登錄實聯制措施</ScannerTip>
        <Url href={url} target="form">{url}</Url>
      </div>
    </div>
  );
}
