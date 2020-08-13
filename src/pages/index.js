import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Input from '../components/Input';
import Note from '../components/Note';
import Button from '../components/Button';
import Link from '../components/Link';

const Title = styled.div`
  font-size: 1.4em;
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 3px solid #767676;
`;

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
      <Title>實聯制 | 電子化解決方案</Title>
      <Note>本服務 Beta 測試中，將於 9月1日 正式提供服務</Note>
      <Note>使用準則</Note>
      <Note>1. 本服務為 AGPL 3.0 開源專案，由 mutix Co., Ltd.（以下簡稱本公司）維運，並免費提供使用</Note>
      <Note>2. 本公司不會對使用者、商家、非營利組織、政府及任何個人與組織收取任何費用</Note>
      <Note>
        <span>3. 想參與貢獻嗎？可至 </span>
        <Link href="https://github.com/mutix-co/covid19" target="github">https://github.com/mutix-co/covid19</Link>
        <span> 貢獻程式碼、法律及教學文件，或捐款給長期關注隱私權的</span>
        <Link href="https://ocf.tw/" target="ocf">開放文化基金會</Link>
        <span>或</span>
        <Link href="https://www.tahr.org.tw/" target="tahr">台灣人權促進會</Link>
      </Note>
      <Note>服務條款</Note>
      <Note>
        <span>1. 本服務基於</span>
        <Link href="https://www.cdc.gov.tw/File/Get/t-_Xs5DDee2qzBFC1fRXJA" target="covid19">
          「COVID-19(武漢肺炎)」防疫新生活運動：實聯制措施指引
        </Link>
        <span>所開發，以明確告知、僅存28天、禁止目的外利用、配合疫調、安全維護及資安防護為原則</span>
      </Note>
      <Note>2. 加密資料將交由 mutix Co., Ltd.（以下簡稱本公司）暫時保管，並儲存於 Google 位於台灣的機房</Note>
      <Note>3. 我已知悉個資保護是基於 x25519-xsalsa20-poly1305 加解密技術實作</Note>
      <Note>4. 我已知悉個資將於 28 日後自動完全情除</Note>
      <Note>5. 我已知悉如遺失金鑰，本公司無法提供任何技術將其資料解密</Note>
      <Note>6. 我已知悉本公司無法擔保登錄者資料之真實性</Note>
      <Note>7. 除收到中華民國政府公文或司法文件外，本公司不提供任何資料的查閱或修改</Note>
      <Note>8. 除重大災害或不可抗力之因素外，本公司確保 99.8% 的時間正常服務，但本公司不負任何賠償責任</Note>
      <Note>9. 本服務條款有關的爭議，除法律另有規定者外，均應依照中華民國法律予以處理，並以台灣台北地方法院為管轄法院</Note>
      <Input title="店名或活動名稱" onChange={onChange} value={title} />
      <Note>點擊「產生實聯制網址」後視同您已閱讀，瞭解並同意接受本服務條款</Note>
      <Button type="submit">產生實聯制網址</Button>
    </form>
  );
}
