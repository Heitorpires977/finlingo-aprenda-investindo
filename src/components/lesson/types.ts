export interface Activity {
  type: string;
  question: string;
  options?: string[];
  correct?: number | boolean;
  answer?: string;
  explanation?: string;
  pairs?: { left: string; right: string }[];
}
