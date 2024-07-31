/**
 * @jest-environment node
 */

// __tests__/api-login.test.ts
import { NextRequest } from 'next/server';
import { POST } from '../../src/app/api/login/route';
import axios from 'axios';

// axiosをモック化
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('/api/login', () => {
  it('returns token on successful login', async () => {
    // モックされたaxiosレスポンスの設定
    mockAxios.post.mockResolvedValueOnce({
      data: { token: 'mocked_token' },
    });

    // モックされたリクエストオブジェクトの作成
    const req = {
      json: async () => ({ username: 'testuser', password: 'testpass' }),
    } as NextRequest;

    // POSTハンドラーの呼び出し
    const res = await POST(req);

    // レスポンスの検証
    const json = await res.json();
    expect(json).toEqual({ token: 'mocked_token' });
    expect(res.status).toBe(200);

    // axios.postが正しい引数で呼び出されたことを確認
    expect(mockAxios.post).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
      { username: 'testuser', password: 'testpass' }
    );
  });

  it('returns 401 on failed login', async () => {
    // モックされたaxiosエラーレスポンスの設定
    mockAxios.post.mockRejectedValueOnce(new Error('Login failed'));

    // モックされたリクエストオブジェクトの作成
    const req = {
      json: async () => ({ username: 'wronguser', password: 'wrongpass' }),
    } as NextRequest;

    // POSTハンドラーの呼び出し
    const res = await POST(req);

    // レスポンスの検証
    const json = await res.json();
    expect(json).toEqual({ message: 'Login failed' });
    expect(res.status).toBe(401);

    // axios.postが正しい引数で呼び出されたことを確認
    expect(mockAxios.post).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
      { username: 'wronguser', password: 'wrongpass' }
    );
  });
});
