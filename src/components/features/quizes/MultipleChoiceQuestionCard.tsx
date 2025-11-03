// src/components/features/quizes/MultipleChoiceQuestionCard.tsx
import React from 'react';
import { Card, Typography, Space, Radio, Tag, Button, Tooltip, Collapse } from 'antd';
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CheckCircleFilled } from '@ant-design/icons';

const { Paragraph } = Typography;
const { Panel } = Collapse;

// Định nghĩa kiểu dữ liệu cho Question
interface MCQItem {
    id: string;
    question: string;
    options: string[];
    correct: string;
    explanation?: string;
}

interface MultipleChoiceQuestionCardProps {
    item: MCQItem;
    index: number;
    onEdit: (question: MCQItem) => void;
    onDelete: (id: string) => void;
}

const MultipleChoiceQuestionCard: React.FC<MultipleChoiceQuestionCardProps> = ({ item, index, onEdit, onDelete }) => {
    return (
        <Card
            key={item.id}
            style={{ marginBottom: '10px' }}
            className='mb-4 hover:shadow-lg transition-shadow'
            title={<span className='font-semibold'>Câu {index + 1}: {item.question}</span>}
            extra={
                <Space size="small">
                    <Tag color="geekblue">Mức độ: Dễ</Tag>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => onEdit(item)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => onDelete(item.id)}
                        />
                    </Tooltip>
                </Space>
            }
        >
            <div className={`flex flex-col ${item.explanation ? 'lg:flex-row' : ''} lg:space-x-4`}>
                <div className={`${item.explanation ? 'lg:w-1/2' : 'w-full'} mb-4 lg:mb-0`}>
                    <Radio.Group value={item.correct} className='mt-2 w-full'>
                        <Space direction="vertical" className='w-full'>
                            {item.options.map((opt, i) => {
                                const isCorrect = opt === item.correct;
                                return (
                                    <div
                                        key={i}
                                        className={`p-2 rounded-md transition-all flex items-center w-full ${isCorrect ? 'bg-green-50 border border-green-300' : 'hover:bg-gray-50'}`}
                                    >
                                        <Radio
                                            value={opt}
                                            disabled
                                            style={{ color: isCorrect ? 'green' : undefined, fontWeight: 'bold' }}
                                        >
                                            <span className='mr-2 font-semibold'>{String.fromCharCode(65 + i)}.</span>
                                            {opt}
                                        </Radio>
                                        {isCorrect && <CheckCircleFilled className="text-green-500 ml-auto" />}
                                    </div>
                                );
                            })}
                        </Space>
                    </Radio.Group>
                </div>
                {item.explanation && (
                    <div className='lg:w-1/2'>
                        <Collapse bordered={false} defaultActiveKey={['1']} className='bg-white'>
                            <Panel
                                header={<Space><CheckCircleOutlined className="text-blue-500" /> Giải thích đáp án</Space>}
                                key="1"
                                className='!border-t-0'
                            >
                                <Paragraph className='bg-blue-50 p-3 rounded-md !mb-0'>{item.explanation}</Paragraph>
                            </Panel>
                        </Collapse>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default MultipleChoiceQuestionCard;