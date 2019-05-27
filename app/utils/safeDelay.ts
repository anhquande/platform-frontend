const POLLING_TIME = 10;
const TIME_THRESHOLD = 100;

export enum EDelayTiming {
  EXACT,
  NOTEXACT,
}

let lastActiveTimerId = 0;
let activeTimers: number[] = [];

const safeSetTimeoutRec = (fn: (d: EDelayTiming) => void, endTime: number, timerId: number) => {
  const msToEnd = Date.now() - endTime;

  setTimeout(
    () => {
      if (!activeTimers.includes(timerId)) {
        return;
      }

      const now = Date.now();
      if (now >= endTime) {
        fn(now - endTime <= TIME_THRESHOLD ? EDelayTiming.EXACT : EDelayTiming.NOTEXACT);
      } else {
        safeSetTimeoutRec(fn, endTime, timerId);
      }
    },
    msToEnd <= POLLING_TIME ? msToEnd : POLLING_TIME,
  );
};

export const safeSetTimeout = (fn: (d: EDelayTiming) => void, ms: number): any => {
  const timerId = ++lastActiveTimerId;

  activeTimers.push(timerId);

  safeSetTimeoutRec(fn, Date.now() + ms, timerId);
};

export const clearSafeTimeout = (timerId: number): void => {
  activeTimers = activeTimers.filter(id => id !== timerId);
};

export function safeDelay(ms: number): Promise<EDelayTiming> {
  return new Promise(resolve => {
    safeSetTimeout(resolve, ms);
  });
}
