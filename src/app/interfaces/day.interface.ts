export type DayType = 'text' | 'image' | 'link';

export interface Day {
    id: number;
    date: Date;
    content: string; // The text, image url, or link url
    isOpen: boolean;
    type: DayType;
    title?: string; // Optional title for the modal
}
