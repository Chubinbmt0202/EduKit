import React, { useState } from 'react';

// Dữ liệu ban đầu
const initialItems = [
    { id: 'item-1', content: 'Cá voi', category: null },
    { id: 'item-2', content: 'Rắn', category: null },
    { id: 'item-3', content: 'Chó', category: null },
    { id: 'item-4', content: 'Thằn lằn', category: null },
    { id: 'item-5', content: 'Dơi', category: null },
];

const categories = {
    mammals: { id: 'mammals', title: 'Động vật Có vú', items: [] as typeof initialItems },
    reptiles: { id: 'reptiles', title: 'Bò sát', items: [] as typeof initialItems },
};

const SortPage: React.FC = () => {
    // State quản lý các mục chưa được phân loại và các danh mục
    const [unclassifiedItems, setUnclassifiedItems] = useState(initialItems);
    const [classifiedCategories, setClassifiedCategories] = useState(categories);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    // Xử lý khi chọn một mục
    const handleItemClick = (itemId: string) => {
        // Nếu đã có mục được chọn, bỏ chọn
        if (selectedItemId === itemId) {
            setSelectedItemId(null);
        } else {
            // Chọn mục mới
            setSelectedItemId(itemId);
        }
    };

    // Xử lý khi chọn một danh mục (để mô phỏng việc thả mục đã chọn)
    const handleCategoryDrop = (targetCategory: 'mammals' | 'reptiles') => {
        if (!selectedItemId) return;

        // 1. Tìm mục được chọn và xóa khỏi danh sách chưa phân loại
        const itemToMoveIndex = unclassifiedItems.findIndex(item => item.id === selectedItemId);
        if (itemToMoveIndex === -1) return; // Mục đã nằm trong danh mục khác hoặc lỗi

        const itemToMove = unclassifiedItems[itemToMoveIndex];

        // 2. Cập nhật danh sách chưa phân loại
        const newUnclassified = unclassifiedItems.filter(item => item.id !== selectedItemId);
        setUnclassifiedItems(newUnclassified);

        // 3. Thêm mục vào danh mục đích
        setClassifiedCategories(prevCategories => ({
            ...prevCategories,
            [targetCategory]: {
                ...prevCategories[targetCategory],
                items: [...prevCategories[targetCategory].items, { ...itemToMove, category: targetCategory }]
            }
        }));

        // 4. Reset mục đã chọn
        setSelectedItemId(null);
    };

    // Component Thẻ mục (Item Card)
    const ItemCard: React.FC<{ item: typeof initialItems[0] }> = ({ item }) => (
        <div
            className={`
                p-3 my-2 text-center rounded-lg shadow-sm border cursor-pointer transition-all duration-200
                ${selectedItemId === item.id
                    ? 'bg-yellow-200 border-yellow-500 shadow-md transform scale-105'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }
            `}
            onClick={() => handleItemClick(item.id)}
        >
            <span className="font-medium text-gray-700">{item.content}</span>
        </div>
    );

    // Component Khu vực Thả (Drop Zone/Category)
    const CategoryZone: React.FC<{ categoryId: 'mammals' | 'reptiles' }> = ({ categoryId }) => {
        const category = classifiedCategories[categoryId];
        const isTarget = selectedItemId !== null;

        return (
            <div
                className={`
                    w-full min-h-[300px] p-4 rounded-xl border-4 transition-all duration-300
                    ${isTarget
                        ? 'border-dashed border-blue-400 bg-blue-50 cursor-pointer hover:bg-blue-100'
                        : 'border-gray-200 bg-gray-50'
                    }
                `}
                onClick={() => handleCategoryDrop(categoryId)}
            >
                <h2 className="text-xl font-bold mb-3 text-center text-blue-800 border-b pb-2 border-blue-200">
                    {category.title}
                </h2>
                <div className="space-y-2">
                    {category.items.map(item => (
                        <div key={item.id} className="p-2 bg-white rounded shadow text-gray-800 border border-green-300">
                            {item.content}
                        </div>
                    ))}
                    {category.items.length === 0 && <p className="text-center text-gray-500 italic text-sm mt-8">Kéo thả mục vào đây</p>}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full bg-white p-6 md:p-10">
            {/* Tiêu đề */}
            <h1 className="text-3xl font-extrabold mb-8 text-gray-800">
                Phân loại: Kéo thả các đáp án vào ô hợp lý
            </h1>

            {/* Hộp chứa các mục chưa phân loại */}
            <div className="mb-8 p-4 border rounded-xl bg-gray-100 shadow-inner">
                <h2 className="text-xl font-semibold mb-3 text-gray-700">
                    Các đáp án (Nhấp để chọn, sau đó nhấp vào ô đích)
                </h2>
                <div className="flex flex-wrap gap-4 justify-center">
                    {unclassifiedItems.map(item => (
                        <div key={item.id} className="w-1/4 min-w-[120px]">
                            <ItemCard item={item} />
                        </div>
                    ))}
                    {unclassifiedItems.length === 0 && <p className="text-gray-500 italic py-4">Đã phân loại hết!</p>}
                </div>
            </div>

            {/* Khu vực phân loại (Drop Zones) */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Cột 1: Động vật Có vú */}
                <div className="w-full md:w-1/2">
                    <CategoryZone categoryId="mammals" />
                </div>

                {/* Cột 2: Bò sát */}
                <div className="w-full md:w-1/2">
                    <CategoryZone categoryId="reptiles" />
                </div>
            </div>
        </div>
    );
};

export default SortPage;