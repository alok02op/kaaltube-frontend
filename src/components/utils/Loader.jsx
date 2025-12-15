export default function Loader() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            {/* Spinner */}
            <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

            {/* Text */}
            <h1 className="mt-6 text-xl font-semibold text-gray-700 tracking-wide animate-pulse">
                Loading...
            </h1>
        </div>
    )
}
