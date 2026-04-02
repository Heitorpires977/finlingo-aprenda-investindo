export interface Activity {
  type: string;
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
  highlight?: string; // card de destaque para ExampleSlide
}

export type LessonStep = (Activity & { _kind: 'activity' }) | (ContentSlide & { _kind: 'slide' });

/** Default intro slides for lessons that don't have their own */
export const DEFAULT_INTRO_SLIDES: ContentSlide[] = [
  {
    type: 'explanation',
    title: 'O que são Juros? 🤔',
    emoji: '💡',
    body: 'Juros são o "aluguel" do dinheiro. Quando você pega dinheiro emprestado, paga um valor extra pelo tempo que ficou com ele. Quando você empresta (ou investe), recebe esse valor extra como recompensa.\n\nPense assim: se você empresta sua bicicleta para um amigo por uma semana, faz sentido ele te devolver com o pneu calibrado, certo? Com dinheiro é parecido — quem empresta quer receber um "agrado" de volta.',
  },
  {
    type: 'example',
    title: 'Na Prática: O Lanche de R$10 🍔',
    emoji: '🎯',
    body: 'Imagine que você pediu R$10 emprestado para um colega para comprar um lanche. Ele disse: "Beleza, mas me devolve R$11 na semana que vem."\n\nEsse R$1 a mais é o juro! No mundo financeiro, diríamos que a taxa de juros foi de 10% ao período.',
    highlight: 'Você pegou R$10 → devolveu R$11\nJuros = R$1 (taxa de 10%)\n\n📌 Quanto maior a taxa, mais caro fica "alugar" dinheiro!',
  },
];
