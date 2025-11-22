import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SoundService {
    private sounds: { [key: string]: HTMLAudioElement } = {};
    private muted = false;

    constructor() {
        this.loadSounds();
    }

    private loadSounds() {
        // Using free sound effects from reliable CDNs or base64 placeholders for demo
        // In a real app, these would be local assets
        this.sounds['open'] = new Audio('https://assets.mixkit.co/active_storage/sfx/2007/2007-preview.mp3'); // Paper slide/open
        this.sounds['success'] = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'); // Jingle/Chime
        this.sounds['error'] = new Audio('https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'); // Error buzz
        this.sounds['hohoho'] = new Audio('https://assets.mixkit.co/active_storage/sfx/2674/2674-preview.mp3'); // Santa laugh

        // Preload
        Object.values(this.sounds).forEach(audio => audio.load());
    }

    play(soundName: 'open' | 'success' | 'error' | 'hohoho') {
        if (this.muted) return;

        const audio = this.sounds[soundName];
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.warn('Audio play failed', e));
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
}
