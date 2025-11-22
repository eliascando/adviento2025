import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdventService } from './services/advent.service';
import { SoundService } from './services/sound.service';
import { DayCardComponent } from './components/day-card/day-card.component';
import { ModalComponent } from './components/modal/modal.component';
import { Day } from './interfaces/day.interface';
import { inject as injectAnalytics } from '@vercel/analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DayCardComponent, ModalComponent],
  template: `
    <div class="min-h-screen bg-gray-900 relative overflow-x-hidden pb-20">
      <!-- Snowflakes (CSS handled in styles.scss) -->
      <div class="snowflake" *ngFor="let i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]">❄</div>

      <!-- Header -->
      <header class="text-center py-12 relative z-10">
        <div class="absolute top-0 left-0 p-4 animate-pulse">
          <span class="text-6xl text-christmas-gold opacity-50">❄️</span>
        </div>
        <div class="absolute top-0 right-0 p-4 animate-pulse" style="animation-delay: 1s;">
          <span class="text-6xl text-christmas-gold opacity-50">❄️</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-bold text-christmas-gold drop-shadow-lg font-serif mb-4 cursor-pointer tracking-wider"
            (click)="playHoHoHo()">
          Calendario de Adviento
        </h1>
        <p class="text-xl text-christmas-cream font-serif tracking-wide">
          Abre cada día la casilla y descubre si te toca premio.
        </p>
        <div class="mt-4 flex justify-center gap-4 items-center">
          <div class="text-white bg-christmas-green px-4 py-2 rounded-full shadow-lg">
            Progreso: {{ adventService.openedDaysCount() }} / 25
          </div>
          <button (click)="toggleMute()" class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors" title="Silenciar/Activar sonido">
            {{ isMuted() ? '🔇' : '🔊' }}
          </button>
        </div>
      </header>

      <!-- Grid -->
      <main class="container mx-auto px-4 relative z-10 mb-12">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-w-6xl mx-auto">
          <app-day-card 
            *ngFor="let day of adventService.days()" 
            [day]="day"
            (open)="handleOpenDay($event)">
          </app-day-card>
        </div>
      </main>

      <!-- Footer / Dev Tools -->
      <footer class="container mx-auto px-4 relative z-10 text-center text-gray-500 text-sm pb-8">
        <div class="flex flex-col items-center gap-4">
          <button (click)="resetProgress()" 
                  class="text-red-400 hover:text-red-300 underline transition-colors">
            Reiniciar Progreso
          </button>
          
          <!-- Dev Tools Toggle -->
          <div class="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 max-w-md w-full">
            <div class="flex justify-between items-center mb-2 cursor-pointer" (click)="showDevTools.set(!showDevTools())">
              <span class="font-bold text-gray-400">🛠️ Dev Tools (Cheat Mode)</span>
              <span>{{ showDevTools() ? '▼' : '▶' }}</span>
            </div>
            
            <div *ngIf="showDevTools()" class="space-y-3 text-left">
              <div>
                <label class="block text-xs mb-1">Simular Fecha Actual:</label>
                <input type="date" 
                       [ngModel]="simulatedDateStr()" 
                       (ngModelChange)="updateSimulatedDate($event)"
                       class="bg-gray-700 text-white px-2 py-1 rounded w-full">
              </div>
              <p class="text-xs text-gray-400">
                Cambia la fecha para probar abrir días futuros o pasados.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <!-- Modal -->
      <app-modal 
        *ngIf="selectedDay()" 
        [day]="selectedDay()!" 
        (close)="closeModal()">
      </app-modal>

      <!-- Toast / Notification -->
      <div *ngIf="notification()" 
           class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce">
        {{ notification() }}
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {
  adventService = inject(AdventService);
  soundService = inject(SoundService);

  selectedDay = signal<Day | null>(null);
  notification = signal<string | null>(null);
  isMuted = signal(false);

  // Dev Tools Signals
  showDevTools = signal(false);
  simulatedDateStr = signal(new Date().toISOString().split('T')[0]);

  constructor() {
    // Initialize Vercel Analytics
    injectAnalytics();

    // Effect to update service date when simulated date changes
    effect(() => {
      const dateStr = this.simulatedDateStr();
      // Create date at noon to avoid timezone issues with day rollover
      const newDate = new Date(dateStr + 'T12:00:00');
      this.adventService.currentDate.set(newDate);
    });
  }

  handleOpenDay(id: number) {
    this.soundService.play('open');

    // Small delay to allow animation to start/sound to play
    setTimeout(() => {
      const result = this.adventService.openDay(id);

      if (result.success) {
        this.soundService.play('success');
        const day = this.adventService.days().find(d => d.id === id);
        if (day) {
          this.selectedDay.set(day);
        }
      } else {
        this.soundService.play('error');
        this.showNotification(result.message || 'Error al abrir el día');
      }
    }, 100);
  }

  closeModal() {
    this.selectedDay.set(null);
  }

  playHoHoHo() {
    this.soundService.play('hohoho');
  }

  toggleMute() {
    this.isMuted.set(this.soundService.toggleMute());
  }

  resetProgress() {
    if (confirm('¿Estás seguro de querer reiniciar todo el progreso?')) {
      localStorage.removeItem('advent_calendar_progress');
      window.location.reload();
    }
  }

  updateSimulatedDate(dateStr: string) {
    this.simulatedDateStr.set(dateStr);
  }

  private showNotification(message: string) {
    this.notification.set(message);
    setTimeout(() => this.notification.set(null), 3000);
  }
}
