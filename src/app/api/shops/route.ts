import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// セレクトボックス店舗名で使うデータをリクエストするプロキシ
export async function GET() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/shops`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
