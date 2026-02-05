import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DateUtils } from "../../../utils/date-utils";
import { Routine } from "../../interfaces/routine";
import { RoutineService } from "../../services/routine/routine.service";
import { ToasterComponent } from "../shared/toaster/toaster.component";

@Component({
  selector: 'app-routine',
  standalone: true,
  imports: [CommonModule, FormsModule, ToasterComponent],
  templateUrl: './routine.component.html',
  styleUrls: ['../budget/budget.component.css']
})
export class RoutineComponent implements OnInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
  dateUtils = DateUtils;
  routines: Routine[] = [];
  model: Routine = {
    id: '',
    userId: '',
    fromTime: '',
    toTime: '',
    task: ''
  };
  isEdit: boolean = false;
  selectedId: string = '';
  constructor(private service: RoutineService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getRoutineByUser().subscribe(res => {
      this.routines = res;
      this.routines.forEach(r => r.duration = this.calculateDuration(r.fromTime, r.toTime));
    });
  }

  calculateDuration(from: string, to: string): string {
    const start = new Date(`1970-01-01T${from}`);
    let end = new Date(`1970-01-01T${to}`);

    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    const diff = (end.getTime() - start.getTime()) / 60000;
    const h = Math.floor(diff / 60);
    const m = diff % 60;

    return `${h}:${m.toString().padStart(2, '0')}`;
  }

  calculateDurationInMinutes(from: string, to: string): number {
    const start = new Date(`1970-01-01T${from}`);
    let end = new Date(`1970-01-01T${to}`);

    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    const diff = (end.getTime() - start.getTime()) / 60000;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    let timeInMinut = h * 60 + m;
    // return `${h}:${m.toString().padStart(2, '0')}`;
    return timeInMinut;
  }

  edit(item: Routine) {
    this.model = { ...item };
    this.isEdit = true;
    this.selectedId = this.model.id || '';
  }
  reset() {
    this.model = {
      id: '',
      userId: '',
      fromTime: '',
      toTime: '',
      task: ''
    };
    this.isEdit = false;
    this.selectedId = '';
  }

  delete(id: string) {
    if (!confirm('Delete this entry?')) return;

    this.service.deleteRoutine(id)
      .subscribe(() => {
        this.toaster.showMessage('Routine entry deleted successfully', 'success');
        this.loadData();
      });
  }

  save(row: Routine) {
    row.fromTime = DateUtils.normalizeTime(row.fromTime);
    row.toTime = DateUtils.normalizeTime(row.toTime);

    if (!row.fromTime || !row.toTime || !row.task) {
      this.toaster.showMessage('Please fill all fields', 'error');
      return;
    }
    if (this.calculateDurationInMinutes(row.fromTime, row.toTime) <= 9) {
      this.toaster.showMessage('Duration must be at least 10 minutes', 'error');
      return;
    }
    if (this.isEdit) {
      if (this.routines.find(r => r.id === row.id) == undefined) {
        this.toaster.showMessage('Routine entry not found for update', 'error');
        return;
      }
      this.service.updateRoutine(row).subscribe(() => {
        alert('Saved successfully');
        this.toaster.showMessage('Routine entry updated successfully', 'success');
        this.loadData();
        this.reset();

      });
    } else {
      if (this.routines.find(r => r.task === row.task && r.fromTime === row.fromTime && r.toTime === row.toTime) != undefined) {
        this.toaster.showMessage('Duplicate routine entry found', 'error');
        return;
      }
      row.id = null!;
      this.service.addRoutine(row)
        .subscribe(() => {
          this.toaster.showMessage('Routine entry added successfully', 'success');
          this.loadData();
          this.reset();
        });
    }
  }
}
