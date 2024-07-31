import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/') {
    // ルートパスにアクセスがあった場合、/loginにリダイレクト
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const token = req.cookies.get('token'); // トークンをCookieから取得
  if (!token) {
    // トークンがない場合、ログインページにリダイレクト
    return NextResponse.redirect(new URL('/login', req.url));
  }
  try {
    // トークンが有効かどうかをサーバーに確認
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-token`,{
      headers: {
        'Authorization': `Bearer ${token?.value} `
      }
    });
    
    
    if (response.status !== 200) {
      
      return NextResponse.redirect(new URL('/login', req.url));
    }
  } catch (error) {
    // トークンの確認に問題があった場合は、クッキーを無効化し、/loginへリダイレクトする
    const response = NextResponse.redirect(new URL('/login', req.url));
    // クッキーをクリア
    response.cookies.set('token', '', { expires: new Date(0), path: '/' });

    return response
  }

  return NextResponse.next();
}

// 基本、login関係以外はトークンの有効性チェックを行う
export const config = {
  matcher: [
    '/',
    '/users/:path*',
    '/reservation/:path*', 
    '/search/:path*',
    '/api/reservation/:path*',
    '/api/search/:path*',
    '/api/users/:path*'],
  };