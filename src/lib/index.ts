import { readable } from 'svelte/store';
import * as duration from 'duration-fns';
import type { DateInput, Duration } from 'duration-fns';

// HACK: without this some of the units are negative for some reason.
function makePositive(dur: Duration) {
  for (const unit of duration.UNITS) {
    dur[unit] = Math.abs(dur[unit]);
  }
}

// NOTE: code modified from https://blog.bitsrc.io/how-to-get-an-accurate-setinterval-in-javascript-ca7623d1d26a.
export default function countdown(until: DateInput, interval = 1000) {
  let between = duration.normalize(duration.between(Date.now(), until));
  makePositive(between);
  return readable(between, set => {
    let counter = 1;
    let timeoutId: ReturnType<typeof setTimeout>;
    const startTime = Date.now();

    function main() {
      const nowTime = Date.now();
      const nextTime = startTime + counter * interval;
      timeoutId = setTimeout(main, interval - (nowTime - nextTime));

      counter += 1;
      between = duration.normalize(duration.subtract(between, { milliseconds: interval }));
      makePositive(between);

      set(between);
    }

    timeoutId = setTimeout(main, interval);

    return () => {
      clearTimeout(timeoutId);
    };
  });
}
