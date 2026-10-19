import type { Session } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";
import { supabase } from "./supabase";

export interface AuthState {
  /** Початкове відновлення сесії завершено. */
  ready: boolean;
  session: Session | null;
  isAdmin: boolean;
}

let state: AuthState = { ready: false, session: null, isAdmin: false };
const listeners = new Set<() => void>();
let started = false;

const setState = (next: Partial<AuthState>) => {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
};

const checkAdmin = async (session: Session | null) => {
  if (!session) {
    setState({ isAdmin: false });
    return;
  }

  try {
    const { data, error } = await supabase.rpc("is_admin");
    setState({ isAdmin: !error && data === true });
  } catch {
    setState({ isAdmin: false });
  }
};

export const getAuthState = () => state;

/** Запускає відстеження сесії один раз. */
export const startAuth = () => {
  if (started) {
    return;
  }
  started = true;

  supabase.auth.onAuthStateChange((_event, session) => {
    setState({ ready: true, session });
    // Запит у базу не можна робити всередині колбека напряму: даємо клієнту завершити оновлення сесії.
    window.setTimeout(() => void checkAdmin(session), 0);
  });

  supabase.auth
    .getSession()
    .then(({ data }) => {
      setState({ ready: true, session: data.session });
      void checkAdmin(data.session);
    })
    .catch(() => setState({ ready: true }));
};

export const useAuth = (): AuthState =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getAuthState,
    getAuthState,
  );

export const signInWithEmail = async (email: string): Promise<string | null> => {
  const redirect = window.location.origin + window.location.pathname;
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: { emailRedirectTo: redirect, shouldCreateUser: true },
  });

  return error ? error.message : null;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
