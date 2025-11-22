import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Day } from '../../interfaces/day.interface';

@Component({
  selector: 'app-day-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center gap-2 group">
      <div 
        class="relative w-full aspect-square cursor-pointer perspective-1000"
        (click)="onOpen()"
        [@flipState]="day.isOpen ? 'open' : 'closed'">
        
        <!-- Front (Closed) -->
        <div class="absolute w-full h-full backface-hidden rounded-xl shadow-lg 
                    flex items-center justify-center overflow-hidden
                    transform transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1"
             [ngClass]="themeClass">
          
          <!-- Pattern Overlay -->
          <div class="absolute inset-0 opacity-20" [ngClass]="patternClass"></div>
          
          <!-- Number -->
          <span class="relative z-10 text-5xl md:text-6xl font-bold drop-shadow-md font-serif"
                [class.text-christmas-gold]="theme === 'red' || theme === 'green'"
                [class.text-christmas-red]="theme === 'gold' || theme === 'cream'">
            {{ day.id }}
          </span>

          <!-- Decorative Icon (Random based on ID) -->
          <div class="absolute bottom-2 right-2 text-2xl opacity-80">
            {{ getIcon(day.id) }}
          </div>
        </div>

        <!-- Back (Open) -->
        <div class="absolute w-full h-full backface-hidden rounded-xl shadow-inner 
                    bg-christmas-cream rotate-y-180 flex items-center justify-center
                    border-4 border-dashed overflow-hidden"
             [class.border-christmas-red]="theme === 'red' || theme === 'cream'"
             [class.border-christmas-green]="theme === 'green'"
             [class.border-christmas-gold]="theme === 'gold'">
          <div class="text-center p-2">
            <ng-container [ngSwitch]="day.type">
              <span *ngSwitchCase="'image'" class="text-4xl">🖼️</span>
              <span *ngSwitchCase="'link'" class="text-4xl">🔗</span>
              <span *ngSwitchDefault class="text-4xl">📜</span>
            </ng-container>
          </div>
        </div>
      </div>
      
      <!-- Label Below -->
      <div class="text-christmas-cream font-serif text-sm opacity-90">
        Día {{ day.id }}
      </div>
    </div>
  `,
  styles: [`
    .perspective-1000 { perspective: 1000px; }
    .backface-hidden { backface-visibility: hidden; }
    .rotate-y-180 { transform: rotateY(180deg); }
  `],
  animations: [
    trigger('flipState', [
      state('closed', style({ transform: 'rotateY(0)' })),
      state('open', style({ transform: 'rotateY(180deg)' })),
      transition('closed => open', animate('0.6s cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('open => closed', animate('0.6s cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class DayCardComponent implements OnInit {
  @Input({ required: true }) day!: Day;
  @Output() open = new EventEmitter<number>();

  theme: 'red' | 'green' | 'gold' | 'cream' = 'red';
  pattern: 'stripes' | 'dots' | 'checkers' | 'none' = 'none';

  themeClass = '';
  patternClass = '';

  ngOnInit() {
    this.assignTheme();
  }

  onOpen() {
    if (!this.day.isOpen) {
      this.open.emit(this.day.id);
    }
  }

  private assignTheme() {
    const themes: ('red' | 'green' | 'gold' | 'cream')[] = ['red', 'green', 'gold', 'cream'];
    const patterns: ('stripes' | 'dots' | 'checkers' | 'none')[] = ['stripes', 'dots', 'checkers', 'none'];

    // Deterministic assignment based on ID to keep it consistent across renders
    this.theme = themes[(this.day.id * 7) % themes.length];
    this.pattern = patterns[(this.day.id * 3) % patterns.length];

    this.themeClass = this.getThemeClass(this.theme);
    this.patternClass = this.pattern !== 'none' ? `pattern-${this.pattern}` : '';
  }

  private getThemeClass(theme: string): string {
    switch (theme) {
      case 'red': return 'bg-christmas-light-red text-christmas-gold';
      case 'green': return 'bg-christmas-green text-christmas-gold';
      case 'gold': return 'bg-christmas-gold text-christmas-red';
      case 'cream': return 'bg-christmas-cream text-christmas-red';
      default: return 'bg-christmas-red';
    }
  }

  getIcon(id: number): string {
    const icons = ['🎄', '🎅', '🎁', '⭐', '🕯️', '🦌', '❄️', '🔔', '🍪', '🥛'];
    return icons[id % icons.length];
  }
}
