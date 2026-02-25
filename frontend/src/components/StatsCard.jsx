export default function StatsCard({ title, value, color }) {
    return (
        <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500 font-medium">
                {title}
            </p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>
                {value}
            </p>
        </div>
    );
}
