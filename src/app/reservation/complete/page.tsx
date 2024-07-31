// app/reservation/complete/page.tsx
'use client';

// 予約完了時にメッセージを表示する。
export default function ReservationCompletePage() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">予約完了</h2>
        <p className="text-center">予約確認は、Homeから確認して下さい</p>
      </div>
    </div>
  );
}
