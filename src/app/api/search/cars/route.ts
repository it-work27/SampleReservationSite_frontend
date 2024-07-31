import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// バックエンドに予約可能な車両一覧のリクエストするプロキシ
export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/search/cars`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    return NextResponse.json(response.data);
  } catch (error) {

    console.error('Error searching cars:', error);
    // エラーが発生した場合のレスポンス処理
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // サーバーからのレスポンスがあり、エラーレスポンスが含まれる場合
        return NextResponse.json({ message: error.response.data || 'An error occurred' }, { status: error.response.status });
      }
      // リクエストが送信されたが、レスポンスが受け取れなかった場合
      return NextResponse.json({ message: 'No response received from server' }, { status: 500 });
    }

    // axiosのエラーでない場合
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });

  }
}
