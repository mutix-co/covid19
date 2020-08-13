import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Input from '../components/Input';
import Button from '../components/Button';

export default function c() {
  const router = useRouter();
  const [title, setTitle] = useState('');

  const onSubmit = useCallback((e) => {
    router.push({ pathname: '/g', query: { t: title } });
    e.preventDefault();
  }, [title]);

  const onChange = useCallback((e) => setTitle(e.target.value), []);

  return (
    <form onSubmit={onSubmit}>
      <Input title="店家或活動名稱" onChange={onChange} value={title} />
      <Button type="submit">產生實聯制網址</Button>
    </form>
  );
}
