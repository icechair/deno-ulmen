export type Signal<TMessage> = (message: TMessage) => void;
export type Effect<TMessage> = (signal: Signal<TMessage>) => void;

export interface INext<TState, TMessage> {
  state: TState;
  effect?: Effect<TMessage>;
}

export type Update<TMessage, TState> = (
  msg: TMessage,
  state: TState
) => INext<TState, TMessage>;

export type View<TState, TMessage, TView = void> = (
  state: TState,
  signal: Signal<TMessage>
) => TView;

export interface Program<TState, TMessage, TView = void> {
  init: INext<TState, TMessage>;
  update: Update<TMessage, TState>;
  view: View<TState, TMessage, TView>;
}
