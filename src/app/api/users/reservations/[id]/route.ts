import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// バックエンドに予約詳細をリクエストするプロキシ
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/reservations/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching reservation details:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
