export type Signal<TMessage> = (message: TMessage) => void;
export type Effect<TMessage> = (signal: Signal<TMessage>) => void;

export interface INext<TState, TMessage> {
  state: TState;
  effect?: Effect<TMessage>;
}

export type Update<TMessage, TState> = (
  msg: TMessage,
  state: TState,
) => INext<TState, TMessage>;

export type View<TState, TMessage, TView = void> = (
  state: TState,
  signal: Signal<TMessage>,
) => TView;

export interface Program<TState, TMessage, TView = void> {
  init: INext<TState, TMessage>;
  update: Update<TMessage, TState>;
  view: View<TState, TMessage, TView>;
}

export function runtime<TState, TMessage, TView = void>(
  program: Program<TState, TMessage, TView>,
): void {
  const { init, update, view } = program;
  let current: TState;

  const signal = (message: TMessage) =>
    setTimeout(() => change(update(message, current)), 0);

  const change = (next: INext<TState, TMessage>) => {
    const { state, effect } = next;
    current = state;
    if (effect) setTimeout(() => effect(signal), 0);
    view(current, signal);
  };

  change(init);
}
