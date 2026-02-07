export interface Routine {
  id: string;
  userId: string;
  fromTime: string;
  toTime: string;
  task: string;
  duration?: number;
}
