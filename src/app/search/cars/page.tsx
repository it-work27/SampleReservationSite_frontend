'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Shop {
  id: number;
  shop_name: string;
}

interface CarModel {
  id: number;
  carmodel_name: string;
}

interface SearchResult {
  carId: number;
  shopName: string;
  carModelName: string;
  departureDate: string;
  returnDate: string;
  price: number;
}

// 予約可能な車両の一覧表示および検索機能を提供する。
export default function SearchCarsPage() {
  const [departureDate, setDepartureDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');
  const [shopId, setShopId] = useState<string>('');
  const [carModelId, setCarModelId] = useState<string>('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [listId, setListId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchShopsAndCarModels = async () => {
      try {

        // セレクトボックス店舗名で使うデータをリクエスト
        const shopResponse = await axios.get('/api/shops');
        setShops(shopResponse.data);
        // セレクトボックス車種で使うデータをリクエスト
        const carModelResponse = await axios.get('/api/carmodels');
        setCarModels(carModelResponse.data);

      } catch (error) {
        console.error('Error fetching shops and car models:', error);
      }
    };

    fetchShopsAndCarModels();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // バックエンドに予約可能な車両一覧のリクエスト
      const response = await axios.post('/api/search/cars', {
        departureDate,
        returnDate,
        shopId,
        carModelId,
      });

      setListId(response.data.listId);
      setSearchResults(response.data.carDetails);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // 予約可能な車両がない、または日付に不正な情報が入力された際にエラーを表示（例：過去日付の選択、返却日が出発日の前など）
        alert(error.response?.data?.message || 'Error occurred during search');
      } else {
        // それ以外のエラー
        alert('An unexpected error occurred');
      }
      console.error('Error searching cars:', error);
    }
  };

  // 予約ボタン押下時のハンドラー
  const handleReserve = (carId: number) => {
    router.push(`/reservation/${listId}/${carId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 mt-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">車を検索</h2>
        <form className="space-y-4" onSubmit={handleSearch}>
          <div>
            <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">
              出発日
            </label>
            <input
              type="date"
              id="departureDate"
              name="departureDate"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
              返却日
            </label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="shopId" className="block text-sm font-medium text-gray-700">
              店舗名
            </label>
            <select
              id="shopId"
              name="shopId"
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              required
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">店舗を選択</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.shop_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="carModelId" className="block text-sm font-medium text-gray-700">
              車種名
            </label>
            <select
              id="carModelId"
              name="carModelId"
              value={carModelId}
              onChange={(e) => setCarModelId(e.target.value)}
              required
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">車種を選択</option>
              {carModels.map((carModel) => (
                <option key={carModel.id} value={carModel.id}>
                  {carModel.carmodel_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              検索
            </button>
          </div>
        </form>

        <h2 className="mt-8 text-2xl font-bold text-center">検索結果一覧</h2>
        { typeof searchResults !== 'undefined' ? (
        // {searchResults.length > 0 ? (
          <table className="min-w-full mt-4 bg-white divide-y divide-gray-200">
            <thead>
              <tr>
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
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  予約
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchResults.map((result) => (
                <tr key={result.carId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {result.shopName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {result.carModelName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {result.departureDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {result.returnDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ¥{result.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleReserve(result.carId)}
                      className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      予約
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-4 text-center">レンタル可能な車両がありません。</p>
        )}
      </div>
    </div>
  );
}
