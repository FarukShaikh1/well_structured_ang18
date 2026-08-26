import { Component } from '@angular/core';
import { BudgetComponent } from '../budget/budget.component';
import { RoutineComponent } from '../routine/routine.component';
import { CredentialsComponent } from '../credentials/credentials.component';

@Component({
  selector: 'app-self-data',
  standalone: true,
  imports: [BudgetComponent, RoutineComponent, CredentialsComponent],
  templateUrl: './self-data.component.html',
  styleUrl: './self-data.component.css'
})
export class SelfDataComponent {

  selectedPrintSection: string | null = null;

  constructor() {
    window.addEventListener('afterprint', () => {
      this.onAfterPrint();
    });
  }

  printSection(section: string): void {
    debugger;
    this.selectedPrintSection = section;

    // Allow Angular to apply the class before printing
    setTimeout(() => {
      window.print();
    });
  }

  onAfterPrint(): void {
    this.selectedPrintSection = null;
  }
}
