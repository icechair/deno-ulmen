/**
 * @template TState
 * @template TMessage
 * @param {import("./mod.d.ts").Program<TState,TMessage>} program
 */
export const runtime = (program) => {
  const { init, update, view } = program;
  /**
   * @type {TState}
   */
  let current;

  /**
   *
   * @param {TMessage} message
   */
  const signal = (message) => change(update(message, current));
  /**
   *
   * @param {import("./mod.d.ts").INext<TState,TMessage>} next
   */
  const change = (next) => {
    const { state, effect } = next;
    current = state;
    if (effect) setTimeout(() => effect(signal), 0);
    view(current, signal);
  };

  change(init);
};
