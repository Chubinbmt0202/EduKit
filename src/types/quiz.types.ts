export interface QuestionMCQ {
    question_text: string;
    options: string[];
    correct_answer_index: number;
}

export interface StatementTF {
    statement_text: string;
    is_true: boolean;
}

export interface SentenceFillBlank {
    sentence_with_blank: string;
    answer: string;
}

export interface MatchingPair {
    item_a: string;
    item_b: string;
}

export interface Flashcard {
    front: string;
    back: string;
}

export interface SortingCategory {
    category_name: string;
    items: string[];
}

// Union type cho các loại game
export interface GeneratedGame {
    game_type: 'multiple_choice_abcd' | 'true_false' | 'fill_in_the_blank' | 'matching' | 'flashcards' | 'sorting';
    questions?: QuestionMCQ[];
    statements?: StatementTF[];
    sentences?: SentenceFillBlank[];
    pairs?: MatchingPair[];
    cards?: Flashcard[];
    deck_title?: string;
    categories?: SortingCategory[];
    instruction?: string;
}

export interface QuizData {
    id: string;
    filename: string;
    generated_games: GeneratedGame[];
}