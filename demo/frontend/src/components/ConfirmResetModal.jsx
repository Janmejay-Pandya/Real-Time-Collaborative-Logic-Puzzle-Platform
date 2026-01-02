import { AlertTriangle, X } from "lucide-react";

export default function ConfirmResetModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border-2 border-red-500/30 max-w-md w-full mx-4 transform transition-all animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-500/20 p-3 rounded-full">
                            <AlertTriangle className="text-red-400" size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Reset Puzzle?</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                    >
                        <X size={24} />
                    </button>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                    Are you sure you want to reset the puzzle? This will clear all cells and cannot be undone. All players in this room will see the reset.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-600 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition-all duration-200 active:scale-95 border-2 border-red-400/30"
                    >
                        Reset Puzzle
                    </button>
                </div>
            </div>
        </div>
    );
}

