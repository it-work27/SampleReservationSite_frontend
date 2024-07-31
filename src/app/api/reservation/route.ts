import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// バックエンドで予約確定リクエストするプロキシ
export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = req.cookies.get('token');

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/reservation`, body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.value} `
      },
      withCredentials: true,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error confirming reservation:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
