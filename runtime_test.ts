import { runtime } from "./runtime.js";
import { Signal } from "./mod.d.ts";
import { delay } from "https://deno.land/std/async/delay.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
Deno.test("runtime test", async () => {
  const state = 0;
  const counter = {
    effect: 0,
    update: 0,
    view: 0,
  };
  const effect = (signal: Signal<string>) => {
    counter.effect += 1;
    signal("from-effect");
  };
  const update = (msg: string, state: number) => {
    counter.update += 1;
    if (msg == "from-view" && state == 0) return { state: 1, effect };
    if (msg == "from-effect" && state == 1) return { state: 2 };
    throw Error("update called with invalid state");
  };
  const view = (state: number, signal: Signal<string>) => {
    counter.view += 1;
    if (state == 0) return signal("from-view");
    if (state == 1) return;
    if (state == 2) return;
    throw Error("view called with invalid staate");
  };
  const init = { state };
  runtime({ init, update, view });
  await delay(1);
  assertEquals(counter.effect, 1, "effect shoud have ran 1 times");
  assertEquals(counter.update, 2, "update shoud run 2 times");
  assertEquals(counter.view, 3, "view shoud run 3 times");
});
