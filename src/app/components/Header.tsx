'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// 各画面共通のヘッダーを表示する
const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = getCookie('token');
      if (token) {
        setIsLoggedIn(true);
      }
    };
    checkLoginStatus();
  }, []);

  // ログイン・ログアウトボタン押下時のハンドラー
  const handleLoginLogout = async () => {
    const token = getCookie('token');

    if (token) {
      // バックエンドにログアウト処理をリクエスト
      await axios.post('/api/logout');
      setIsLoggedIn(false);
      router.replace('/login');
      window.location.reload();
  
    } else {
      router.replace('/');

    }

  };

  // クッキーを取得するヘルパー関数
  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/users/home" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link href="/search/cars" className="hover:underline">Search</Link>
          </li>
              <li>
                <Link href="/users/home" className="hover:underline">Profile</Link>
              </li>
              <li>
                <button onClick={handleLoginLogout} className="hover:underline">Login / Logout</button>
              </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
