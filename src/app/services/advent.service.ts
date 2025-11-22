import { Injectable, signal, computed, effect } from '@angular/core';
import { Day } from '../interfaces/day.interface';

@Injectable({
    providedIn: 'root'
})
export class AdventService {
    private readonly STORAGE_KEY = 'advent_calendar_progress';

    // Signals
    days = signal<Day[]>([]);
    currentDate = signal<Date>(new Date()); // In a real app, this would be new Date()

    // Computed
    openedDaysCount = computed(() => this.days().filter(d => d.isOpen).length);

    constructor() {
        this.initializeDays();
        this.loadState();

        // Effect to save state whenever days change
        effect(() => {
            this.saveState();
        });
    }

    private initializeDays() {
        const currentYear = new Date().getFullYear();
        const mockData = this.getMockData();

        const initialDays: Day[] = Array.from({ length: 25 }, (_, i) => {
            const dayId = i + 1;
            const data = mockData[(dayId - 1) % mockData.length];

            return {
                id: dayId,
                date: new Date(currentYear, 11, dayId), // Month is 0-indexed (11 = Dec)
                content: data.content,
                isOpen: false,
                type: data.type,
                title: `Día ${dayId}`
            };
        });
        this.days.set(initialDays);
    }

    private getMockData(): { type: 'text' | 'image' | 'link', content: string }[] {
        return [
            { type: 'text', content: "¡Feliz inicio de Adviento! Recuerda sonreír hoy." },
            { type: 'text', content: "Un chiste: ¿Qué le dice un semáforo a otro? ¡No me mires que me estoy cambiando!" },
            { type: 'text', content: "Tip: Bebe agua, hidrátate bien." },
            { type: 'image', content: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=800&q=80" },
            { type: 'text', content: "Receta rápida: Chocolate caliente con malvaviscos." },
            { type: 'text', content: "Escucha tu canción navideña favorita hoy." },
            { type: 'link', content: "https://www.youtube.com/watch?v=aAkMkVFwAoo" },
            { type: 'text', content: "Llama a un amigo que hace tiempo no ves." },
            { type: 'text', content: "Dona algo que ya no uses." },
            { type: 'image', content: "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=800&q=80" },
            { type: 'text', content: "Escribe 3 cosas por las que estás agradecido." },
            { type: 'text', content: "Haz un dibujo navideño." },
            { type: 'image', content: "https://images.unsplash.com/photo-1511268011861-691ed6d995ff?auto=format&fit=crop&w=800&q=80" },
            { type: 'text', content: "Mira una película de Navidad." },
            { type: 'link', content: "https://open.spotify.com/playlist/37i9dQZF1DX0Yxoavh5qJV" }
        ];
    }

    openDay(id: number): { success: boolean; message?: string } {
        const day = this.days().find(d => d.id === id);
        if (!day) return { success: false, message: 'Día no encontrado' };

        const now = this.currentDate();
        // For testing purposes, we can comment out the date validation or use a mock date
        // In production:
        if (day.date > now) {
            return { success: false, message: '¡Aún no es momento de abrir este regalo! 🎅' };
        }

        this.days.update(days =>
            days.map(d => d.id === id ? { ...d, isOpen: true } : d)
        );
        return { success: true };
    }

    private loadState() {
        const savedState = localStorage.getItem(this.STORAGE_KEY);
        if (savedState) {
            const parsedState = JSON.parse(savedState) as number[]; // Array of opened IDs
            this.days.update(days =>
                days.map(d => parsedState.includes(d.id) ? { ...d, isOpen: true } : d)
            );
        }
    }

    private saveState() {
        const openedIds = this.days().filter(d => d.isOpen).map(d => d.id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(openedIds));
    }
}
