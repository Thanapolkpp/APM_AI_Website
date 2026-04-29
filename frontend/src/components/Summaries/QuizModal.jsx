import React, { useState } from "react";
import { HiOutlineX, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";

const QuizModal = ({ isOpen, onClose, quiz, isLoading, onReward }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    if (!isOpen) return null;

    const handleAnswer = (index) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index);
        if (index === quiz[currentQuestion].answer) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentQuestion < quiz.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                setSelectedAnswer(null);
            } else {
                setShowResults(true);
                onReward(score + (index === quiz[currentQuestion].answer ? 1 : 0));
            }
        }, 1500);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowResults(false);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-900 rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl border border-white/20 relative"
            >
                <div className="p-6 border-b dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg">
                            <Trophy size={20} />
                        </div>
                        <h3 className="text-xl font-black dark:text-white">AI Quiz Challenge</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <HiOutlineX size={24} />
                    </button>
                </div>

                <div className="p-8 min-h-[400px] flex flex-col items-center justify-center">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-4">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="text-blue-500"
                            >
                                <Sparkles size={48} />
                            </motion.div>
                            <p className="font-black text-gray-500 animate-pulse uppercase tracking-widest text-sm">AI กำลังออกข้อสอบให้จ้า...</p>
                        </div>
                    ) : showResults ? (
                        <div className="text-center space-y-6 animate-in zoom-in duration-500">
                            <div className="size-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-xl text-white">
                                <Trophy size={48} />
                            </div>
                            <h4 className="text-3xl font-black dark:text-white">จบการทดสอบ!</h4>
                            <p className="text-5xl font-black text-blue-500">{score} / {quiz?.length}</p>
                            <p className="text-gray-500 font-bold">{score >= 4 ? "สุดยอดไปเลยครับเพื่อน! 🌷" : "สู้ๆ นะครับ ลองอ่านใหม่อีกรอบ! ✨"}</p>
                            <button 
                                onClick={onClose}
                                className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black shadow-xl hover:scale-105 transition-all"
                            >
                                กลับไปหน้าสรุป
                            </button>
                        </div>
                    ) : quiz && quiz.length > 0 ? (
                        <div className="w-full space-y-8">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Question {currentQuestion + 1} of {quiz.length}</span>
                                <div className="h-2 w-32 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-500 transition-all duration-500" 
                                        style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                            
                            <h4 className="text-xl font-black dark:text-white leading-relaxed">{quiz[currentQuestion].question}</h4>
                            
                            <div className="grid grid-cols-1 gap-4">
                                {quiz[currentQuestion].options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(i)}
                                        className={`p-5 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between group
                                            ${selectedAnswer === null 
                                                ? "border-gray-100 dark:border-white/5 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:text-white" 
                                                : i === quiz[currentQuestion].answer 
                                                    ? "border-green-500 bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                                                    : i === selectedAnswer
                                                        ? "border-red-500 bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400"
                                                        : "border-gray-100 dark:border-white/5 opacity-50 dark:text-white"
                                            }
                                        `}
                                    >
                                        <span>{opt}</span>
                                        {selectedAnswer !== null && i === quiz[currentQuestion].answer && <HiOutlineCheckCircle size={24} />}
                                        {selectedAnswer === i && i !== quiz[currentQuestion].answer && <HiOutlineXCircle size={24} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-400 font-bold">ไม่พบข้อมูลควิซ</p>
                            <button onClick={onClose} className="mt-4 text-blue-500 font-black">ปิดหน้าต่าง</button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default QuizModal;
