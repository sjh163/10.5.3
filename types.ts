export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface TimerState {
  totalSeconds: number;
  remainingSeconds: number;
  status: TimerStatus;
}

export interface PresetTime {
  label: string;
  minutes: number;
}