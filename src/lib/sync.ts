import type { User } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";
import {
  adoptGuestProgress,
  loadActiveNickname,
  loadProgress,
  mergeProgress,
  normalizeProgress,
  saveActiveNickname,
  saveProgress,
  subscribeToProgress,
} from "../utils/storage";
import { getAuthState, startAuth } from "./auth";
import { supabase } from "./supabase";

export type SyncStatus = "idle" | "syncing" | "ok" | "error";

let status: SyncStatus = "idle";
const listeners = new Set<() => void>();
let started = false;
let pulling = false;
let pushTimer: number | undefined;

const setStatus = (next: SyncStatus) => {
  status = next;
  listeners.forEach((listener) => listener());
};

export const useSyncStatus = (): SyncStatus =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => status,
    () => "idle" as SyncStatus,
  );

const emailPrefix = (user: User) => (user.email ?? "").split("@")[0].slice(0, 32);

const push = async (user: User) => {
  const nickname = loadActiveNickname();
  const now = new Date().toISOString();

  const [progress, profile] = await Promise.all([
    supabase.from("progress").upsert({ user_id: user.id, data: loadProgress(nickname), updated_at: now }),
    supabase.from("profiles").upsert({ user_id: user.id, nickname, last_seen: now }),
  ]);

  if (progress.error || profile.error) {
    throw progress.error ?? profile.error;
  }
};

/** Забирає прогрес із хмари, зливає з локальним і відправляє результат назад. */
export const pullAndMerge = async () => {
  const user = getAuthState().session?.user;

  if (!user || pulling) {
    return;
  }

  pulling = true;
  setStatus("syncing");

  try {
    const [profileResult, progressResult] = await Promise.all([
      supabase.from("profiles").select("nickname").eq("user_id", user.id).maybeSingle(),
      supabase.from("progress").select("data").eq("user_id", user.id).maybeSingle(),
    ]);

    if (profileResult.error || progressResult.error) {
      throw profileResult.error ?? progressResult.error;
    }

    // Нікнейм з акаунта головніший; якщо його немає, лишаємо локальний або беремо початок email.
    const nickname = profileResult.data?.nickname || loadActiveNickname() || emailPrefix(user);

    if (nickname !== loadActiveNickname()) {
      adoptGuestProgress(nickname);
      saveActiveNickname(nickname);
    }

    const local = loadProgress(nickname);
    const remote = normalizeProgress(progressResult.data?.data);
    saveProgress(nickname, mergeProgress(local, remote));
    await push(user);
    setStatus("ok");
  } catch {
    setStatus("error");
  } finally {
    pulling = false;
  }
};

/** Відправляє поточний прогрес у хмару (з невеликою затримкою, щоб не слати кожну відповідь окремо). */
export const schedulePush = () => {
  const user = getAuthState().session?.user;

  if (!user || pulling) {
    return;
  }

  window.clearTimeout(pushTimer);
  pushTimer = window.setTimeout(() => {
    setStatus("syncing");
    push(user)
      .then(() => setStatus("ok"))
      .catch(() => setStatus("error"));
  }, 1500);
};

export const pushNow = async (): Promise<boolean> => {
  const user = getAuthState().session?.user;

  if (!user) {
    return false;
  }

  try {
    await push(user);
    setStatus("ok");
    return true;
  } catch {
    setStatus("error");
    return false;
  }
};

/** Видаляє дані користувача з хмари (прогрес, профіль, події статистики). Локальний прогрес лишається. */
export const deleteCloudData = async (): Promise<boolean> => {
  const user = getAuthState().session?.user;

  if (!user) {
    return false;
  }

  window.clearTimeout(pushTimer);
  const results = await Promise.all([
    supabase.from("progress").delete().eq("user_id", user.id),
    supabase.from("profiles").delete().eq("user_id", user.id),
    supabase.from("events").delete().eq("user_id", user.id),
  ]);

  return results.every((result) => !result.error);
};

let lastUserId = "";

export const startSync = () => {
  if (started || typeof window === "undefined") {
    return;
  }
  started = true;
  startAuth();

  // Вхід або відновлена сесія: один раз на користувача (повторно при поверненні на вкладку).
  const stopAuthWatch = supabase.auth.onAuthStateChange((_event, session) => {
    const id = session?.user.id ?? "";

    if (id && id !== lastUserId) {
      lastUserId = id;
      window.setTimeout(() => void pullAndMerge(), 0);
    } else if (!id) {
      lastUserId = "";
      setStatus("idle");
    }
  });
  void stopAuthWatch;

  subscribeToProgress(schedulePush);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      void pullAndMerge();
    }
  });
};
