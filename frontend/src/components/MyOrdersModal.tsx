import { useEffect, useState } from "react";
import { getOrders } from "../api/orders";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MyOrdersModal({
  open,
  onClose,
}: Props) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      load();
    }
  }, [open]);

  async function load() {
    const data = await getOrders();
    setOrders(data);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md backdrop-saturate-150 transition-all duration-300" onClick={onClose}>
        <div
        className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 animate-[fadeIn_.25s_ease]"
        onClick={(e) => e.stopPropagation()}
        >
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 p-5">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Orders
            </h2>

            <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-2xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-red-500 transition"
            >
            ✕
            </button>
        </div>

        <div className="p-5 space-y-4">
            {orders.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-300 py-10">
                No orders found.
            </div>
            ) : (
            orders.map((o) => (
                <div
                key={o.id}
                className="bg-slate-50 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-xl p-5 hover:shadow-lg transition"
                >
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold capitalize text-slate-900 dark:text-white">
                    {o.beverage}
                    </h3>

                    <span className="font-semibold text-green-600 dark:text-green-400">
                    {o.quantity} {o.quantity > 1 ? "Cups" : "Cup"}
                    </span>
                </div>

                <div className="mt-2 text-gray-500 dark:text-gray-300">
                    📍 {o.location}
                </div>

                <div className="mt-1 text-gray-500 dark:text-gray-400">
                    📅 {new Date(o.order_date).toLocaleDateString()}
                </div>
                </div>
            ))
            )}
        </div>
        </div>
    </div>
    );
}