// src/types/course.types.ts
export interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    thumbnail?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Quiz {
    id: string;
    title: string;
    courseId: string;
    questions: Question[];
    timeLimit?: number;
    passingScore: number;
}

export interface Question {
    id: string;
    title: string;
    type: 'multiple-choice' | 'short-answer';
    options?: string[];
    correctAnswer: string;
}