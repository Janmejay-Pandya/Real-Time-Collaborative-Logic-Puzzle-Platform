import { useEffect } from "react";
import { X } from "lucide-react";

export default function NumberInputModal({ isOpen, onClose, onSelect }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const numbers = [1, 2, 3, 4];
    const colors = [
        "from-blue-500 to-blue-600",
        "from-purple-500 to-purple-600",
        "from-pink-500 to-pink-600",
        "from-orange-500 to-orange-600",
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 shadow-2xl border border-purple-500/30 max-w-md w-full mx-4 transform transition-all animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Select Number</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    {numbers.map((num, idx) => (
                        <button
                            key={num}
                            onClick={() => {
                                onSelect(num);
                                onClose();
                            }}
                            className={`bg-gradient-to-br ${colors[idx]} text-white text-4xl font-bold py-6 rounded-2xl shadow-lg hover:scale-110 hover:shadow-2xl transition-all duration-200 active:scale-95 border-2 border-white/20 hover:border-white/40`}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => {
                        onSelect(0);
                        onClose();
                    }}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xl font-semibold py-4 rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 active:scale-95 border-2 border-white/20 hover:border-white/40"
                >
                    Erase (0)
                </button>
            </div>
        </div>
    );
}

