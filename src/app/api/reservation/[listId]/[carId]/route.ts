import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// 検索結果一覧で選択された情報をもとに予約情報の詳細をリクエストするプロキシ
export async function GET(req: NextRequest, { params }: { params: { listId: string; carId: string } }) {
  const { listId, carId } = params;
  const token = req.cookies.get('token');

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reservation/${listId}/${carId}`,{
      headers: {
        'Authorization': `Bearer ${token?.value} `
      }
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching reservation details:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
