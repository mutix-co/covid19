import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Input from '../components/Input';
import Note from '../components/Note';
import Button from '../components/Button';

export default function index() {
  const router = useRouter();
  const [title, setTitle] = useState('');

  const onSubmit = useCallback((e) => {
    router.push({ pathname: '/g', query: { t: title } });
    e.preventDefault();
  }, [title]);

  const onChange = useCallback((e) => setTitle(e.target.value), []);

  return (
    <form onSubmit={onSubmit}>
      <Input title="店名或活動名稱" onChange={onChange} value={title} />
      <Note>服務條款</Note>
      <Note>1. 加密資料將交由 mutix Co., Ltd.（以下簡稱本公司）暫時保管，並儲存於 Google 位於台灣的機房</Note>
      <Note>2. 我已知悉個資加密是基於 x25519-xsalsa20-poly1305 加密技術實作</Note>
      <Note>3. 我已知悉個資將於 28 日後自動完全情除</Note>
      <Note>4. 我已知悉如遺失金鑰，本公司無法提供任何技術將其資料解密</Note>
      <Note>5. 我已知悉本公司無法擔保登錄者資料之真實性</Note>
      <Note>6. 除收到中華民國政府公文或司法文件外，本公司不提供任何資料的查閱或修改</Note>
      <Note>7. 本服務條款有關的爭議，除法律另有規定者外，均應依照中華民國法律予以處理，並以台灣台北地方法院為管轄法院</Note>
      <Note>產生實聯制網址後視同您已閱讀，瞭解並同意接受本服務條款</Note>
      <Button type="submit">產生實聯制網址</Button>
    </form>
  );
}
