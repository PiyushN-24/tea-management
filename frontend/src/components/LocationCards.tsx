type Props = {
  rows: any[];
};

export default function LocationCards({ rows }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {rows.map((r: any) => (
        <div key={r.location} className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">
            {r.location}
          </h2>
          <div className="mt-4">
            <div className="text-gray-500 dark:text-gray-300">
              Tea
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {r.tea}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-gray-500 dark:text-gray-300">
              Coffee
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {r.coffee}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-gray-500 dark:text-gray-300">
              Total
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {r.total}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}