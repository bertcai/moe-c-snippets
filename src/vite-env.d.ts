/// <reference types="vite/client" />
type Contact = {
    id: string;
    createdAt: number;
    first?: string;
    last?: string;
    email?: string;
    phone?: string;
    favorite?: boolean;
    avatar?: string;
    twitter?: string;
    notes?: string;
}

interface FakeCache {
    [key: string]: boolean;
}

// 代码片段
interface Snippet {
    id?: string;
    name: string;
    content: string;
    language?: string;
    type?: string;
    description?: string;
    tags?: string[];
    createdAt?: number;
}