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
  turn: false,

  attack: (who: 'player' | 'foe') => {
    const stt = state();
    const victim = stt[who];
    const attacker = stt[who === 'player' ? 'foe' : 'player'];

    if (!victim || !attacker) return;

    victim.hp -= attacker.role.ad;

    set({
      [who]: victim,
      turn: !stt.turn,
    });
  },

  defend: (who: 'player' | 'foe') => {
    const stt = state();
    const victim = stt[who];
    const attacker = stt[who === 'player' ? 'foe' : 'player'];

    if (!victim || !attacker) return;

    victim.hp -= attacker.role.ad - victim.role.dr;

    set({
      [who]: victim,
      turn: !stt.turn,
    });
  },

  set,
}));
