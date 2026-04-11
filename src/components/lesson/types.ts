export interface Activity {
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'match_pairs' | 'activity';
  question: string;
  options?: string[];
  correct?: number | boolean;
  answer?: string;
  explanation?: string;
  pairs?: { left: string; right: string }[];
}

export interface ContentSlide {
  type: 'explanation' | 'example';
  title: string;
  body: string;
  emoji?: string;
  highlight?: string;
}

export type LessonStep = (Activity & { _kind: 'activity' }) | (ContentSlide & { _kind: 'slide' });
