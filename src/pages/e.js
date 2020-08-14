import React, {
  useState, useReducer, useCallback, useEffect,
} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
  decode32, encode32, convertStringToUnicode, JSONWebSecretBox,
} from 'jw25519';
import Input from '../components/Input';
import CheckBox from '../components/CheckBox';
import Button from '../components/Button';
import Note from '../components/Note';

const Title = styled.div`
  width: 100%;
  font-size: 1.2em;
  text-align: center;
  margin: 4px;
`;

export default function Event() {
  const router = useRouter();
  const [realName, setRealName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [saved, onSavedChange] = useReducer((state) => !state, false);
  const [publicKey, setPublicKey] = useState(null);

  const { key, t: title } = router.query;

  useEffect(() => {
    if (!key) return;
    const tmp = decode32(key);

    if (tmp.length !== 32) {
      router.push('/');
      return;
    }

    setPublicKey(tmp);
  }, [key]);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const secretBox = new JSONWebSecretBox();
    const signature = convertStringToUnicode(JSON.stringify({
      realName, contactNumber, email,
    }));

    const pkey = encode32(secretBox.keyPair.publicKey);
    const data = secretBox.encrypt(signature, publicKey);
    const res = await axios.post('/api/signature', { key, data: `${pkey}:${data}` });
    location.href = `${location.origin}/c?id=${res.data.id}&t=${title}`;
  }, [title, realName, contactNumber, email, saved]);

  const onRealNameChange = useCallback((e) => setRealName(e.target.value), []);
  const onContactNumberChange = useCallback((e) => setContactNumber(e.target.value), []);
  const onEmailChange = useCallback((e) => setEmail(e.target.value), []);

  return (
    <form onSubmit={onSubmit}>
      <Title>{title}</Title>
      <Input title="真實姓名 (Real Name)" onChange={onRealNameChange} value={realName} />
      <Input title="聯絡電話 (Contact Number)" type="tel" onChange={onContactNumberChange} value={contactNumber} />
      <Input title="電子郵件 (E-mail)" type="email" onChange={onEmailChange} value={email} />
      <CheckBox title="將資料保存於本地便於之後登錄" onChange={onSavedChange} checked={saved} />
      <Note>* 注意共用裝置請勿勾選</Note>
      <Note>服務條款</Note>
      <Note>1. 加密資料將交由 mutix Co., Ltd.（以下簡稱本機構）暫時保管，並儲存於 Google 位於台灣的機房</Note>
      <Note>2. 我已知悉個資加密是基於 x25519-xsalsa20-poly1305 加密技術實作</Note>
      <Note>3. 我已知悉個資將於 28 日後自動完全情除</Note>
      <Note>4. 除收到中華民國政府公文或司法文件外，本機構不提供任何資料的查閱或修改</Note>
      <Note>5. 本服務條款有關的爭議，除法律另有規定者外，均應依照中華民國法律予以處理，並以台灣台北地方法院為管轄法院</Note>
      <Note>登錄後視同您已閱讀，瞭解並同意接受本服務條款</Note>
      <Button type="submit">登錄 (SignIn)</Button>
    </form>
  );
}
