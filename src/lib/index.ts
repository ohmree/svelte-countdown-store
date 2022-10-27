import { readable } from 'svelte/store';
import * as duration from 'duration-fns';
import type { DateInput } from 'duration-fns';

// NOTE: code modified from https://blog.bitsrc.io/how-to-get-an-accurate-setinterval-in-javascript-ca7623d1d26a.
export default function countdown(until: DateInput, interval = 1000) {
  let between = duration.normalize({
    milliseconds: duration.toMilliseconds(duration.between(Date.now(), until)),
  });
  // makePositive(between);
  // between = duration.parse(between);
  return readable(between, set => {
    let counter = 1;
    let timeoutId: ReturnType<typeof setTimeout>;
    const startTime = Date.now();

    function main() {
      const nowTime = Date.now();
      const nextTime = startTime + counter * interval;
      timeoutId = setTimeout(main, interval - (nowTime - nextTime));

      counter += 1;
      between = duration.normalize({
        milliseconds: duration.toMilliseconds(
          duration.subtract(between, { milliseconds: interval }),
        ),
      });
      // between = duration.parse(between);
      // makePositive(between);

      set(between);
    }

    timeoutId = setTimeout(main, interval);

    return () => {
      clearTimeout(timeoutId);
    };
  });
}
