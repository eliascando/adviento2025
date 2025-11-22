import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { Day } from '../../interfaces/day.interface';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" @fadeIn>
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" (click)="close.emit()"></div>
      
      <!-- Content -->
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 
                  border-4 border-christmas-gold text-center transform" @scaleIn>
        
        <button (click)="close.emit()" 
                class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-2xl font-bold text-christmas-red mb-4 font-serif">
          {{ day.title || '¡Sorpresa!' }}
        </h2>

        <div class="py-4">
          <ng-container [ngSwitch]="day.type">
            
            <img *ngSwitchCase="'image'" [src]="day.content" 
                 class="w-full h-64 object-cover rounded-lg shadow-md" 
                 alt="Regalo del día">
            
            <a *ngSwitchCase="'link'" [href]="day.content" target="_blank"
               class="inline-block bg-christmas-green text-white px-6 py-3 rounded-full 
                      hover:bg-green-800 transition-colors font-bold shadow-lg">
              🎁 Abrir Enlace
            </a>
            
            <p *ngSwitchDefault class="text-lg text-gray-700 italic font-medium leading-relaxed">
              "{{ day.content }}"
            </p>

          </ng-container>
        </div>

        <div class="mt-4 text-sm text-gray-500">
          ¡Vuelve mañana para más sorpresas! 🎄
        </div>
      </div>
    </div>
  `,
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-out', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ opacity: 0 }))
            ])
        ]),
        trigger('scaleIn', [
            transition(':enter', [
                style({ transform: 'scale(0.9)', opacity: 0 }),
                animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'scale(1)', opacity: 1 }))
            ])
        ])
    ]
})
export class ModalComponent {
    @Input({ required: true }) day!: Day;
    @Output() close = new EventEmitter<void>();
}
