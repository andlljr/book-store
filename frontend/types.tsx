// types.ts

export interface Task {
    id: number;
    title: string;
    description: string;
    status: string; // Or use an enum for better type safety
    user_id: number;
}
