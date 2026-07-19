"use client";

import { type SetStateAction, useCallback, useSyncExternalStore } from "react";

interface BrowserStoreOptions<T> {
  key: string;
  defaultValue: T;
  deserialize?: (value: string) => T;
  serialize?: (value: T) => string;
}

interface BrowserStore<T> {
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (nextValue: SetStateAction<T>) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createBrowserStore<T>({
  key,
  defaultValue,
  deserialize = JSON.parse,
  serialize = JSON.stringify,
}: BrowserStoreOptions<T>): BrowserStore<T> {
  const listeners = new Set<() => void>();
  let cachedRawValue: string | null | undefined;
  let cachedValue = defaultValue;
  let storageAvailable = true;

  const emitChange = () => {
    listeners.forEach((listener) => listener());
  };

  const readRawValue = () => {
    if (typeof window === "undefined" || !storageAvailable) {
      return cachedRawValue ?? null;
    }

    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      storageAvailable = false;
      console.error(`Unable to read browser storage key "${key}"`, error);
      return cachedRawValue ?? null;
    }
  };

  const getSnapshot = () => {
    const rawValue = readRawValue();

    if (rawValue === cachedRawValue) return cachedValue;

    cachedRawValue = rawValue;
    if (rawValue === null) {
      cachedValue = defaultValue;
      return cachedValue;
    }

    try {
      cachedValue = deserialize(rawValue);
    } catch (error) {
      console.error(`Unable to parse browser storage key "${key}"`, error);
      cachedValue = defaultValue;
    }

    return cachedValue;
  };

  const set = (nextValue: SetStateAction<T>) => {
    const currentValue = getSnapshot();
    const resolvedValue =
      typeof nextValue === "function"
        ? (nextValue as (current: T) => T)(currentValue)
        : nextValue;
    const rawValue = serialize(resolvedValue);

    cachedValue = resolvedValue;
    cachedRawValue = rawValue;

    if (typeof window !== "undefined" && storageAvailable) {
      try {
        window.localStorage.setItem(key, rawValue);
      } catch (error) {
        storageAvailable = false;
        console.error(`Unable to write browser storage key "${key}"`, error);
      }
    }

    emitChange();
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== key) return;
    cachedRawValue = undefined;
    emitChange();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);

    if (listeners.size === 1 && typeof window !== "undefined") {
      window.addEventListener("storage", handleStorage);
    }

    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage);
      }
    };
  };

  return {
    getSnapshot,
    getServerSnapshot: () => defaultValue,
    set,
    subscribe,
  };
}

export function useBrowserStore<T>(store: BrowserStore<T>) {
  const value = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );
  const setValue = useCallback(
    (nextValue: SetStateAction<T>) => store.set(nextValue),
    [store]
  );

  return [value, setValue] as const;
}
