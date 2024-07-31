'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

interface ReservationDetails {
  userName: string;
  userAddress: string;
  userEmail: string;
  departureDate: string;
  returnDate: string;
  shopName: string;
  carModelName: string;
  price: number;
}

// 検索結果一覧から選択された予約情報の詳細を表示する。
export default function ReservationPage() {
  const router = useRouter();
  const { listId, carId } = useParams();
  const [reservationDetails, setReservationDetails] = useState<ReservationDetails | null>(null);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        // 検索結果一覧で選択された情報をもとに予約情報の詳細をリクエスト
        const response = await axios.get(`/api/reservation/${listId}/${carId}`);
        setReservationDetails(response.data);
      } catch (error) {
        console.error('Error fetching reservation details:', error);
      }
    };

    if (listId && carId) {
      fetchReservationDetails();
    }
  }, [listId, carId]);

  // 予約確定ボタん押下時のハンドラー
  const handleConfirmReservation = async () => {
    try {
      await axios.post('/api/reservation', {
        listId,
        carId,
      });
      router.push('/reservation/complete');
    } catch (error) {
      console.error('Error confirming reservation:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 mt-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">予約確認</h2>
        {reservationDetails ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ユーザ名</label>
              <p className="mt-1 text-lg">{reservationDetails.userName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">住所</label>
              <p className="mt-1 text-lg">{reservationDetails.userAddress}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <p className="mt-1 text-lg">{reservationDetails.userEmail}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">出発日</label>
              <p className="mt-1 text-lg">{reservationDetails.departureDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">返却日</label>
              <p className="mt-1 text-lg">{reservationDetails.returnDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">店舗名</label>
              <p className="mt-1 text-lg">{reservationDetails.shopName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">車種名</label>
              <p className="mt-1 text-lg">{reservationDetails.carModelName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">料金</label>
              <p className="mt-1 text-lg">¥{reservationDetails.price}</p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleConfirmReservation}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                予約を確定
              </button>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                戻る
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-center">予約内容を読み込み中...</p>
        )}
      </div>
    </div>
  );
}
