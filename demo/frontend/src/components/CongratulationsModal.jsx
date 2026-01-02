import { Trophy, Sparkles, X } from "lucide-react";

export default function CongratulationsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-3xl p-10 shadow-2xl border-4 border-yellow-300 max-w-md w-full mx-4 transform transition-all animate-scaleIn relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute inset-0 opacity-20">
                    <Sparkles className="absolute top-4 left-4 text-yellow-200 animate-pulse" size={30} />
                    <Sparkles className="absolute top-8 right-8 text-orange-200 animate-pulse" size={25} style={{ animationDelay: '0.5s' }} />
                    <Sparkles className="absolute bottom-6 left-8 text-pink-200 animate-pulse" size={28} style={{ animationDelay: '1s' }} />
                    <Sparkles className="absolute bottom-4 right-4 text-yellow-200 animate-pulse" size={22} style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="relative z-10">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/20 rounded-lg"
                    >
                        <X size={24} />
                    </button>

                    <div className="text-center space-y-6">
                        {/* Trophy Icon */}
                        <div className="flex justify-center">
                            <div className="bg-white/20 rounded-full p-6 animate-bounce">
                                <Trophy className="text-yellow-200" size={80} />
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                                Congratulations! 🎉
                            </h2>
                            <p className="text-xl text-white/90 font-semibold">
                                You've Completed the Puzzle!
                            </p>
                        </div>

                        {/* Message */}
                        <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                            <p className="text-white text-lg leading-relaxed">
                                Amazing work! You've successfully solved the puzzle with all numbers correctly placed in each row and column.
                            </p>
                        </div>

                        {/* Celebration emojis */}
                        <div className="flex justify-center gap-2 text-3xl">
                            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎊</span>
                            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
                            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🏆</span>
                            <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🎉</span>
                            <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>⭐</span>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="bg-white text-orange-500 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-xl transition-all duration-200 active:scale-95 mt-4"
                        >
                            Awesome!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

