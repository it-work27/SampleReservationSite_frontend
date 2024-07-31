import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

//ログイン処理のリクエストを行うプロキシ
export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, { username, password });
    //console.log(response)
    const token = response.data.token;

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ message: 'Login failed' }, { status: 401 });
  }
}
