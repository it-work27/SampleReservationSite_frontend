'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { format } from 'date-fns';

interface Reservation {
  id: number;
  shop_name: string;
  carmodel_name: string;
  reservation_start_datetime: string;
  reservation_end_datetime: string;
  price: number;
}

// /users/homeにてログインユーザが予約済みの一覧を表示する。
export default function HomePage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // バックエンドに予約済み一覧をリクエスト
        const response = await axios.get('/api/users/reservations');
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching user reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd');
  };

  // 詳細ボタン押下時のハンドラー
  const handleDetailClick = (id: any) => {
    router.push(`/users/reservations/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 mt-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">予約済みの情報一覧</h2>
        {reservations.length > 0 ? (
          <table className="min-w-full mt-4 bg-white divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  No
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  店舗情報
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  車両情報
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  出発日
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  返却日
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  料金
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation, index) => (
                <tr key={reservation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reservation.shop_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reservation.carmodel_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(reservation.reservation_start_datetime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(reservation.reservation_end_datetime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ¥{reservation.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDetailClick(reservation.id)}
                      className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-4 text-center">予約情報がありません。</p>
        )}
      </div>
    </div>
  );
}
