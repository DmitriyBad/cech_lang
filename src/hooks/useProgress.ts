import { useCallback, useEffect, useMemo, useState } from "react";
import {
  StoredProgress,
  emptyProgress,
  loadActiveNickname,
  loadProgress,
  normalizeNickname,
  resetStoredProgress,
  saveActiveNickname,
  saveProgress,
  subscribeToProgress,
} from "../utils/storage";

export function useProgress(totalVerbs = 0) {
  const [activeNickname, setActiveNickname] = useState(() => loadActiveNickname());
  const [progress, setProgress] = useState<StoredProgress>(() => loadProgress(loadActiveNickname()));

  const refreshProgress = useCallback(() => {
    const nextNickname = loadActiveNickname();
    setActiveNickname(nextNickname);
    setProgress(loadProgress(nextNickname));
  }, []);

  useEffect(() => subscribeToProgress(refreshProgress), [refreshProgress]);

  const changeNickname = useCallback((nickname: string) => {
    const nextNickname = saveActiveNickname(nickname);
    setActiveNickname(nextNickname);
    setProgress(loadProgress(nextNickname));
    return nextNickname;
  }, []);

  const updateProgress = useCallback((updater: (current: StoredProgress) => StoredProgress) => {
    const nickname = loadActiveNickname();

    if (!normalizeNickname(nickname)) {
      return;
    }

    const nextProgress = updater(loadProgress(nickname));
    saveProgress(nickname, nextProgress);
    setActiveNickname(nickname);
    setProgress(nextProgress);
  }, []);

  const markVerbLearned = useCallback(
    (verbId: number) => {
      updateProgress((current) => {
        if (current.learnedVerbIds.includes(verbId)) {
          return current;
        }

        return {
          ...current,
          learnedVerbIds: [...current.learnedVerbIds, verbId],
        };
      });
    },
    [updateProgress],
  );

  const registerAnswer = useCallback(
    (verbId: number, isCorrect: boolean) => {
      updateProgress((current) => ({
        ...current,
        correctAnswers: current.correctAnswers + (isCorrect ? 1 : 0),
        wrongAnswers: current.wrongAnswers + (isCorrect ? 0 : 1),
        mistakesByVerbId: isCorrect
          ? current.mistakesByVerbId
          : {
              ...current.mistakesByVerbId,
              [verbId]: (current.mistakesByVerbId[verbId] ?? 0) + 1,
            },
      }));
    },
    [updateProgress],
  );

  const markModuleItemLearned = useCallback(
    (moduleId: string, itemId: string) => {
      updateProgress((current) => {
        const currentModule = current.moduleProgress[moduleId] ?? {
          completedItemIds: [],
          correctAnswers: 0,
          wrongAnswers: 0,
          mistakesByItemId: {},
        };

        if (currentModule.completedItemIds.includes(itemId)) {
          return current;
        }

        return {
          ...current,
          moduleProgress: {
            ...current.moduleProgress,
            [moduleId]: {
              ...currentModule,
              completedItemIds: [...currentModule.completedItemIds, itemId],
            },
          },
        };
      });
    },
    [updateProgress],
  );

  const registerModuleAnswer = useCallback(
    (moduleId: string, itemId: string, isCorrect: boolean) => {
      updateProgress((current) => {
        const currentModule = current.moduleProgress[moduleId] ?? {
          completedItemIds: [],
          correctAnswers: 0,
          wrongAnswers: 0,
          mistakesByItemId: {},
        };

        return {
          ...current,
          correctAnswers: current.correctAnswers + (isCorrect ? 1 : 0),
          wrongAnswers: current.wrongAnswers + (isCorrect ? 0 : 1),
          moduleProgress: {
            ...current.moduleProgress,
            [moduleId]: {
              ...currentModule,
              correctAnswers: currentModule.correctAnswers + (isCorrect ? 1 : 0),
              wrongAnswers: currentModule.wrongAnswers + (isCorrect ? 0 : 1),
              mistakesByItemId: isCorrect
                ? currentModule.mistakesByItemId
                : {
                    ...currentModule.mistakesByItemId,
                    [itemId]: (currentModule.mistakesByItemId[itemId] ?? 0) + 1,
                  },
            },
          },
        };
      });
    },
    [updateProgress],
  );

  const getModuleStats = useCallback(
    (moduleId: string, totalItems = 0) => {
      const moduleProgress = progress.moduleProgress[moduleId] ?? {
        completedItemIds: [],
        correctAnswers: 0,
        wrongAnswers: 0,
        mistakesByItemId: {},
      };
      const totalModuleAnswers = moduleProgress.correctAnswers + moduleProgress.wrongAnswers;

      return {
        ...moduleProgress,
        learnedCount: moduleProgress.completedItemIds.length,
        learnedPercent: totalItems === 0 ? 0 : Math.round((moduleProgress.completedItemIds.length / totalItems) * 100),
        successRate: totalModuleAnswers === 0 ? 0 : Math.round((moduleProgress.correctAnswers / totalModuleAnswers) * 100),
        totalAnswers: totalModuleAnswers,
      };
    },
    [progress.moduleProgress],
  );

  const resetProgress = useCallback(() => {
    const nickname = loadActiveNickname();
    resetStoredProgress(nickname);
    setProgress(emptyProgress);
  }, []);

  const totalAnswers = progress.correctAnswers + progress.wrongAnswers;
  const successRate = totalAnswers === 0 ? 0 : Math.round((progress.correctAnswers / totalAnswers) * 100);
  const learnedPercent = totalVerbs === 0 ? 0 : Math.round((progress.learnedVerbIds.length / totalVerbs) * 100);
  const isLearningLocked = normalizeNickname(activeNickname).length === 0;

  const reviewVerbIds = useMemo(
    () =>
      Object.entries(progress.mistakesByVerbId)
        .filter(([, mistakes]) => mistakes > 2)
        .map(([verbId]) => Number(verbId)),
    [progress.mistakesByVerbId],
  );

  return {
    activeNickname,
    changeNickname,
    isLearningLocked,
    progress,
    learnedCount: progress.learnedVerbIds.length,
    learnedPercent,
    successRate,
    totalAnswers,
    reviewVerbIds,
    markVerbLearned,
    registerAnswer,
    getModuleStats,
    markModuleItemLearned,
    registerModuleAnswer,
    resetProgress,
  };
}
