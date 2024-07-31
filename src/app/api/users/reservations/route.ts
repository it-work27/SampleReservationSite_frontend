import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// バックエンドに予約済み一覧をリクエストするプロキシ
export async function GET(req: NextRequest) {
  const token = req.cookies.get('token');

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reservations`, 
      {
      headers: {
        'Authorization': `Bearer ${token?.value} `
      }
    }
    );
    return NextResponse.json(response.data);
  } catch (error) {
    //console.error('Error fetching user reservations:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
