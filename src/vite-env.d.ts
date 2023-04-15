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
