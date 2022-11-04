import create from 'zustand';

export type StateFN = (s: Partial<State>) => void;

export interface State {
  /** whether it's the owners turn or not */
  turn: boolean;

  player?: CharacterSheet;
  foe?: CharacterSheet;

  attack: (who: 'player' | 'foe') => void;
  defend: (who: 'player' | 'foe') => void;

  set: StateFN;
}

export const useStore = create<State>((set, state) => ({
  turn: true,

  attack: (who: 'player' | 'foe') => {
    const stt = state();
    const victim = stt[who];
    const actor = stt[who === 'player' ? 'foe' : 'player'];

    if (!victim || !actor) return;

    const damage = actor.role.ad * (actor.stacks || 1);

    console.log({actor, victim});

    victim.hp -=
      victim.stance === 'Defence'
        ? damage - victim.role.dr
        : damage;

    if (victim.stance === 'Defence')
      victim.stacks = (victim.stacks || 0) + 1;

    actor.stance = 'Attack';
    actor.stacks = 0;

    set({
      [who]: victim,
      turn: !stt.turn,
    });
  },

  defend: (who: 'player' | 'foe') => {
    const stt = state();
    const victim = stt[who];
    const actor = stt[who === 'player' ? 'foe' : 'player'];
    if (!victim || !actor) return;

    actor.stance = 'Defence';

    set({
      [who]: victim,
      turn: !stt.turn,
    });
  },

  set,
}));
