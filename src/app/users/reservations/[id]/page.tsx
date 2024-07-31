'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { format, isValid, parseISO } from 'date-fns';

interface ReservationDetails {
  username: string;
  useraddress: string;
  useremail: string;
  departuredate: string;
  returndate: string;
  shopname: string;
  carmodelname: string;
  price: number;
}

// users/homeで表示した予約済み一覧の詳細を表示する。
export default function ReservationDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [reservationDetails, setReservationDetails] = useState<ReservationDetails | null>(null);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        // バクエンドに予約詳細をリクエスト
        const response = await axios.get(`/api/users/reservations/${id}`);
        setReservationDetails(response.data);
      } catch (error) {
        console.error('Error fetching reservation details:', error);
      }
    };

    if (id) {
      fetchReservationDetails();
    }
  }, [id]);
  
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'yyyy-MM-dd') : 'Invalid date';
  };

  if (!reservationDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 mt-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">予約詳細</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ユーザ名</label>
            <p className="mt-1 text-lg">{reservationDetails.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">住所</label>
            <p className="mt-1 text-lg">{reservationDetails.useraddress}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <p className="mt-1 text-lg">{reservationDetails.useremail}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">出発日</label>
            <p className="mt-1 text-lg">{formatDate(reservationDetails.departuredate)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">返却日</label>
            <p className="mt-1 text-lg">{formatDate(reservationDetails.returndate)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">店舗名</label>
            <p className="mt-1 text-lg">{reservationDetails.shopname}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">車種名</label>
            <p className="mt-1 text-lg">{reservationDetails.carmodelname}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">料金</label>
            <p className="mt-1 text-lg">¥{reservationDetails.price}</p>
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => router.push('/users/home')}
              className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
