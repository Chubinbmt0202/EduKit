import React from 'react';
import '../component/footerQuiz.css';

const wordsData = [
    { id: 1, text: 'muối', lang: 'vn' },
    { id: 2, text: 'súp', lang: 'vn' },
    { id: 3, text: 'bữa tối', lang: 'vn' },
    { id: 4, text: 'nước ép', lang: 'vn' },
    { id: 5, text: 'phô mai', lang: 'vn' },
    { id: 6, text: 'dinner', lang: 'en' },
    { id: 7, text: 'salt', lang: 'en' },
    { id: 8, text: 'soup', lang: 'en' },
    { id: 9, text: 'juice', lang: 'en' },
    { id: 10, text: 'cheese', lang: 'en' },
];

const getWordsByLang = (lang: 'vn' | 'en') => wordsData.filter(word => word.lang === lang);

const MatchPairsPage: React.FC = () => {

    return (
        <div className="w-[60%] ml-[30%] h-full p-6 md:p-10">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-800">
                Chọn cặp từ
            </h1>
            <div className="flex justify-center space-x-4 md:space-x-12">
                <div className="w-full max-w-xs space-y-2">
                    {getWordsByLang('vn').map(word => (
                        <button className="button flex items-center w-full mb-4 !h-[50px] cursor-pointer transition-all duration-200 bg-white border-gray-300 hover:border-gray-500 hover:shadow-md">
                            <span className="text-lg font-medium">{word.text}</span>
                        </button>
                    ))}
                </div>
                <div className="w-full max-w-xs space-y-2">
                    {getWordsByLang('en').map(word => (
                        <button className="button flex items-center w-full mb-4 !h-[50px] cursor-pointer transition-all duration-200 bg-white border-gray-300 hover:border-gray-500 hover:shadow-md">
                            <span className="text-lg font-medium">{word.text}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MatchPairsPage;