// __tests__/LoginPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import LoginPage from '../../src/app/login/page';
import { useRouter } from 'next/navigation';

// `axios`と`useRouter`をモック化
jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockUseRouter = useRouter as jest.Mock;

describe('LoginPage', () => {
  it('redirects to /search/cars on successful login', async () => {
    // モックされたレスポンスを設定
    mockAxios.post.mockResolvedValueOnce({
      status: 200,
      data: { token: 'mocked_token' },
    });

    const pushMock = jest.fn();
    mockUseRouter.mockReturnValue({ replace: pushMock });

    render(<LoginPage />);

    // ユーザー名とパスワードを入力
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });

    // ログインボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // 非同期のレスポンスを待つ
    await waitFor(() => {
       // 正しい引数でapi呼び出しされているか確認
      expect(mockAxios.post).toHaveBeenCalledWith('/api/login', {
        username: 'testuser',
        password: 'password',
      });
      // クッキーにトークンがセットされることを確認
      expect(document.cookie).toContain('token=mocked_token');
      // 正しいページにリダイレクトされることを確認
      expect(pushMock).toHaveBeenCalledWith('/search/cars');
    });
  });

  it('shows alert on failed login', async () => {
    // モックされたエラーレスポンスを設定
    mockAxios.post.mockRejectedValueOnce(new Error('Login failed'));

    // `window.alert`をモック
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<LoginPage />);

    // ユーザー名とパスワードを入力
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' },
    });

    // ログインボタンをクリック
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // 非同期のレスポンスを待つ
    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith('/api/login', {
        username: 'testuser',
        password: 'password',
      });
      // アラートが表示されることを確認
      expect(window.alert).toHaveBeenCalledWith('Login failed. Please check your credentials.');
    });

    // `window.alert`のモックを解除
    jest.restoreAllMocks();
  });
});
