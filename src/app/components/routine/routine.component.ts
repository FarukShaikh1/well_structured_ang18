import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DateUtils } from "../../../utils/date-utils";
import { Routine } from "../../interfaces/routine";
import { RoutineService } from "../../services/routine/routine.service";

@Component({
  selector: 'app-routine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './routine.component.html'
})
export class RoutineComponent implements OnInit {

  routines: Routine[] = [];

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

  save(row: Routine) {
    row.fromTime = DateUtils.normalizeTime(row.fromTime);
    row.toTime = DateUtils.normalizeTime(row.toTime);
    this.service.updateRoutine(row).subscribe(() => {
      alert('Saved successfully');
      this.loadData();
    });
  }
}
