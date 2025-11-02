/*
 * File: chubinbmt0202/edukit/EduKit-632165e1b9a4407a0f06213c87701ba0223a5e13/src/components/features/quizes/MultipleChoiceTab.tsx
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// Giả định import các components con đã được tạo
import MultipleChoiceEditModal from './MultipleChoiceEditModal';
import MultipleChoiceQuestionCard from './MultipleChoiceQuestionCard';

// Định nghĩa kiểu dữ liệu cho Question
interface MCQItem {
    id: string;
    question: string;
    options: string[];
    correct: string; // Nội dung đáp án đúng
    explanation?: string; // Thêm giải thích
}

// Dữ liệu giả lập ban đầu
const initialMockMCQ: MCQItem[] = [
    {
        id: '1',
        question: "Trong phép tính 9 + 4 = 13, số 4 đã được tách thành bao nhiêu và bao nhiêu theo Cách 1?",
        options: ["1 và 3", "2 và 2", "1 và 4", "3 và 1"],
        correct: "1 và 3",
        explanation: "Để cộng 9 với 4, ta tách 4 thành 1 và 3. Lấy 9 cộng 1 bằng 10, sau đó lấy 10 cộng 3 bằng 13.",
    },
    {
        id: '2',
        question: "Để tính nhanh 20 + 7 + 3, bạn nên nhóm các số nào?",
        options: ["(20 + 7)", "(20 + 3)", "(7 + 3)", "Không cần nhóm"],
        correct: "(7 + 3)",
        explanation: "Quy tắc tính nhanh là nhóm các số có tổng là số tròn chục. Ở đây, (7 + 3 = 10) là hợp lý nhất.",
    },
    {
        id: '3',
        question: "Để tính nhanh 20 + 7 + 3, bạn nên nhóm các số nào?",
        options: ["(20 + 7)", "(20 + 3)", "(7 + 3)", "Không cần nhóm"],
        correct: "(7 + 3)",
        explanation: "Quy tắc tính nhanh là nhóm các số có tổng là số tròn chục. Ở đây, (7 + 3 = 10) là hợp lý nhất.",
    },
];

const MultipleChoiceTab: React.FC = () => {
    const [questions, setQuestions] = useState<MCQItem[]>(initialMockMCQ);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<MCQItem | null>(null);

    // --- Hàm xử lý: Mở Modal (Cho Create và Update) ---
    const handleEdit = useCallback((question: MCQItem | null) => {
        setEditingQuestion(question);
        setIsModalVisible(true);
    }, []);

    // --- Hàm xử lý: XÓA ---
    const handleDelete = useCallback((id: string) => {
        console.log('Xóa câu hỏi với id:', id);
        Modal.confirm({
            title: 'Xác nhận xóa câu hỏi',
            content: 'Bạn có chắc chắn muốn xóa câu hỏi này không?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: () => {
                // MOCK DELETE: Cập nhật state (thao tác API thực tế sẽ thay thế dòng này)
                setQuestions(questions.filter(q => q.id !== id));
            },
        });
    }, [questions]);

    // --- Hàm xử lý: LƯU (CREATE & UPDATE) ---
    const handleSave = useCallback((newQuestion: MCQItem) => {
        if (editingQuestion) {
            // MOCK UPDATE: Tìm và thay thế câu hỏi cũ
            setQuestions(questions.map(q => q.id === newQuestion.id ? newQuestion : q));
        } else {
            // MOCK CREATE: Thêm câu hỏi mới vào đầu danh sách
            setQuestions([newQuestion, ...questions]);
        }
        setEditingQuestion(null);
        setIsModalVisible(false);
    }, [editingQuestion, questions]);

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setEditingQuestion(null);
    }

    return (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            {/* Nút Thêm */}
            <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={() => handleEdit(null)}
                className='mb-6'
            >
                Thêm Câu Hỏi Thủ Công
            </Button>

            {/* Danh sách Câu hỏi (Sử dụng Component Card mới) */}
            <div style={{
                maxHeight: 'calc(100vh - 300px)',
                overflowY: 'auto',
                paddingRight: '10px'
            }}>
                {questions.map((item, index) => (
                    <MultipleChoiceQuestionCard
                        key={item.id}
                        item={item}
                        index={index}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* Modal Chỉnh sửa / Thêm (Sử dụng Component Modal mới) */}
            <MultipleChoiceEditModal
                isModalVisible={isModalVisible}
                editingQuestion={editingQuestion}
                onClose={handleCloseModal}
                onSave={handleSave}
            />
        </div>
    );
};

export default MultipleChoiceTab;