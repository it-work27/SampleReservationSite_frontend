import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// バックエンドでログアウト処理をリクエストするプロキシ
export async function POST(req: NextRequest) {

  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`);

    //const response = NextResponse.next();
    const response = NextResponse.json(null,{status: 200});
    // クッキーをクリアする
    response.cookies.set('token', '', { expires: new Date(0), path: '/' });
    // 成功時に200を返す
    return response;
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Login failed' }, { status: 401 });
  }
}
