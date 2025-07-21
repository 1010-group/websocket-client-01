import React, { useState, useEffect, useRef } from 'react';
import { FaKeyboard, FaRedo, FaClock, FaChartLine } from 'react-icons/fa';
import {  useNavigate } from 'react-router-dom';

const TypingTest = () => {
     const navigate = useNavigate();

    const [texts] = useState([
        "the quick brown fox jumps over the lazy dog and runs through the forest while the sun shines brightly in the clear blue sky making everything look beautiful and peaceful",
        "programming is not just about writing code it is about solving problems and creating solutions that make life easier for people around the world",
        "artificial intelligence and machine learning are transforming the way we work and live by automating tasks and providing insights that were previously impossible",
        "web development requires understanding of multiple technologies including html css javascript and various frameworks to create responsive and interactive applications",
        "typing speed and accuracy are essential skills in the digital age where most communication and work happens through keyboards and computer interfaces"
    ]);

    const [currentText, setCurrentText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const [selectedTime, setSelectedTime] = useState(60);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [errors, setErrors] = useState(0);
    const [correctChars, setCorrectChars] = useState(0);
    const [totalChars, setTotalChars] = useState(0);
    const [bestWpm, setBestWpm] = useState(localStorage.getItem('bestWpm') || 0);
    const [testHistory, setTestHistory] = useState(JSON.parse(localStorage.getItem('testHistory') || '[]'));

    const inputRef = useRef(null);
    const timerRef = useRef(null);

    const timeOptions = [15, 30, 60, 120];

    useEffect(() => {
        generateNewText();
    }, []);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentText]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        completeTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    useEffect(() => {
        if (userInput.length === 1 && !startTime) {
            setStartTime(Date.now());
            setIsActive(true);
        }

        if (userInput.length > 0 && startTime) {
            const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
            const wordsTyped = userInput.trim().split(' ').filter(word => word.length > 0).length;
            const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
            setWpm(currentWpm);

            // Calculate accuracy
            let correct = 0;
            let total = userInput.length;
            let errorCount = 0;

            for (let i = 0; i < userInput.length; i++) {
                if (i < currentText.length) {
                    if (userInput[i] === currentText[i]) {
                        correct++;
                    } else {
                        errorCount++;
                    }
                }
            }

            setCorrectChars(correct);
            setTotalChars(total);
            setErrors(errorCount);
            const currentAccuracy = total > 0 ? Math.round((correct / total) * 100) : 100;
            setAccuracy(currentAccuracy);
        }

        setCurrentIndex(userInput.length);
    }, [userInput, startTime, currentText]);

    const generateNewText = () => {
        const randomText = texts[Math.floor(Math.random() * texts.length)];
        setCurrentText(randomText);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (!isCompleted && timeLeft > 0) {
            setUserInput(value);
        }
    };

    const completeTest = () => {
        setIsActive(false);
        setIsCompleted(true);

        // Save best WPM
        if (wpm > bestWpm) {
            setBestWpm(wpm);
            localStorage.setItem('bestWpm', wpm.toString());
        }

        // Save test history
        const testResult = {
            wpm,
            accuracy,
            errors,
            time: selectedTime,
            date: new Date().toISOString(),
            correctChars,
            totalChars
        };

        const newHistory = [testResult, ...testHistory.slice(0, 9)]; // Keep last 10 tests
        setTestHistory(newHistory);
        localStorage.setItem('testHistory', JSON.stringify(newHistory));
    };

    const resetTest = () => {
        setUserInput('');
        setCurrentIndex(0);
        setStartTime(null);
        setTimeLeft(selectedTime);
        setWpm(0);
        setAccuracy(100);
        setIsActive(false);
        setIsCompleted(false);
        setErrors(0);
        setCorrectChars(0);
        setTotalChars(0);
        generateNewText();
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const changeTime = (time) => {
        setSelectedTime(time);
        setTimeLeft(time);
        resetTest();
    };

    const renderText = () => {
        return currentText.split('').map((char, index) => {
            let className = 'text-base-content/40';

            if (index < userInput.length) {
                className = userInput[index] === char ? 'text-success bg-success/10' : 'text-error bg-error/10';
            } else if (index === currentIndex) {
                className = 'text-base-content bg-primary/30 animate-pulse';
            }

            return (
                <span key={index} className={`${className} px-0.5 py-1 rounded transition-all duration-150`}>
                    {char}
                </span>
            );
        });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Кнопка которая ничего не делает
    const uselessButton = () => {
        // Эта функция ничего не делает, как и просили
    };

    const getWpmColor = () => {
        if (wpm >= 80) return 'text-success';
        if (wpm >= 60) return 'text-warning';
        if (wpm >= 40) return 'text-info';
        return 'text-error';
    };

    const getAccuracyColor = () => {
        if (accuracy >= 95) return 'text-success';
        if (accuracy >= 90) return 'text-warning';
        if (accuracy >= 80) return 'text-info';
        return 'text-error';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200">
            {/* Header */}
            <div className="navbar bg-base-100 shadow-lg">
                <div className="navbar-start">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="btn btn-outline btn-error">
                            Назад
                        </button>
                    </div>
                </div>
                <div className="navbar-center">
                    <div className="flex items-center gap-2">
                        <FaClock className="text-primary" />
                        <span className="font-semibold mr-4">Time:</span>
                        {timeOptions.map(time => (
                            <button
                                key={time}
                                onClick={() => changeTime(time)}
                                className={`btn btn-sm ${selectedTime === time ? 'btn-primary' : 'btn-outline'}`}
                            >
                                {time}s
                            </button>
                        ))}
                    </div>
                </div>
                <div className="navbar-end">
                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <span className="text-base-content/60">Best: </span>
                            <span className="font-bold text-primary">{bestWpm} WPM</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Timer and Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="stat bg-base-100 rounded-lg shadow-md">
                        <div className="stat-title text-sm">Time Left</div>
                        <div className={`stat-value text-2xl ${timeLeft <= 10 ? 'text-error animate-pulse' : 'text-primary'}`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                    <div className="stat bg-base-100 rounded-lg shadow-md">
                        <div className="stat-title text-sm">WPM</div>
                        <div className={`stat-value text-2xl ${getWpmColor()}`}>{wpm}</div>
                    </div>
                    <div className="stat bg-base-100 rounded-lg shadow-md">
                        <div className="stat-title text-sm">Accuracy</div>
                        <div className={`stat-value text-2xl ${getAccuracyColor()}`}>{accuracy}%</div>
                    </div>
                    <div className="stat bg-base-100 rounded-lg shadow-md">
                        <div className="stat-title text-sm">Errors</div>
                        <div className="stat-value text-2xl text-error">{errors}</div>
                    </div>
                    <div className="stat bg-base-100 rounded-lg shadow-md">
                        <div className="stat-title text-sm">Characters</div>
                        <div className="stat-value text-xl text-info">{correctChars}/{totalChars}</div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Typing Area */}
                    <div className="lg:col-span-2">
                        <div className="card bg-base-100 shadow-xl mb-6">
                            <div className="card-body">
                                {/* Text Display */}
                                <div className="mb-6 p-6 bg-base-200 rounded-lg min-h-32">
                                    <div className="text-lg leading-relaxed font-mono tracking-wide">
                                        {renderText()}
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div className="relative">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={userInput}
                                        onChange={handleInputChange}
                                        disabled={isCompleted || timeLeft === 0}
                                        className="input input-bordered w-full text-lg font-mono tracking-wide focus:input-primary"
                                        placeholder={isCompleted || timeLeft === 0 ? "Test completed! Click restart to try again." : "Start typing..."}
                                        autoComplete="off"
                                        spellCheck="false"
                                    />
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm text-base-content/60 mb-1">
                                        <span>Progress</span>
                                        <span>{userInput.length}/{currentText.length}</span>
                                    </div>
                                    <progress
                                        className="progress progress-primary w-full"
                                        value={userInput.length}
                                        max={currentText.length}
                                    ></progress>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                className="btn btn-primary btn-lg gap-2"
                                onClick={resetTest}
                            >
                                <FaRedo />
                                Restart Test
                            </button>

                            {/* Кнопка которая ничего не делает */}
                            <button
                                className="btn btn-outline btn-lg gap-2"
                                onClick={uselessButton}
                            >
                                <FaChartLine />
                                Useless Button
                            </button>
                        </div>
                    </div>

                    {/* Test History */}
                    <div className="lg:col-span-1">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-xl mb-4">Recent Tests</h2>

                                {testHistory.length === 0 ? (
                                    <div className="text-center text-base-content/60 py-8">
                                        <FaChartLine className="text-4xl mx-auto mb-2 opacity-50" />
                                        <p>No tests completed yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {testHistory.map((test, index) => (
                                            <div key={index} className="p-3 bg-base-200 rounded-lg">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-semibold text-primary">{test.wpm} WPM</span>
                                                    <span className="text-sm text-base-content/60">{test.time}s</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-success">{test.accuracy}% acc</span>
                                                    <span className="text-error">{test.errors} errors</span>
                                                </div>
                                                <div className="text-xs text-base-content/50 mt-1">
                                                    {new Date(test.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Completion Modal */}
                {isCompleted && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg mb-4">Test Completed! 🎉</h3>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="stat">
                                    <div className="stat-title">Final WPM</div>
                                    <div className={`stat-value ${getWpmColor()}`}>{wpm}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Accuracy</div>
                                    <div className={`stat-value ${getAccuracyColor()}`}>{accuracy}%</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Errors</div>
                                    <div className="stat-value text-error">{errors}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Characters</div>
                                    <div className="stat-value text-info">{correctChars}/{totalChars}</div>
                                </div>
                            </div>
                            {wpm > bestWpm && (
                                <div className="alert alert-success mb-4">
                                    <span>🏆 New personal best!</span>
                                </div>
                            )}
                            <div className="modal-action">
                                <button className="btn btn-primary" onClick={resetTest}>
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center mt-12 text-base-content/60">
                    <p>Focus on accuracy first, speed will follow • Press Tab + Enter to restart</p>
                </div>
            </div>
        </div>
    );
};

export default TypingTest;