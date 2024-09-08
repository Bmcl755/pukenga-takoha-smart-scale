import { useEffect, useState } from "react";
import { Observable } from "rxjs";

/**
 * Convert an observable into a react state.
 */
export function useObservable<T>(obs: Observable<T>, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const sub = obs.subscribe(setValue);
    return () => sub.unsubscribe();
  }, []);

  return value;
}
