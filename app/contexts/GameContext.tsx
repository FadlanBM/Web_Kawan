"use client";

// ============================================================
// KAWAN — Game Context (SQLite-backed via API routes)
// ============================================================
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  GameState,
  GameAction,
  ProfilSiswa,
  ProgresQuest,
  PengaturanAksesibilitas,
} from "@/app/types";
import {
  getAllProfil,
  getAksesibilitas,
  saveAksesibilitas,
  saveProfil,
  updateProgresQuest as storageUpdateProgresQuest,
  tambahStiker as storageTambahStiker,
  resetProgres as storageResetProgres,
  deleteProfil as storageDeleteProfil,
  getProfilAktifId,
} from "@/app/lib/storage";
import { setVolume } from "@/app/lib/audioManager";

// ---- Initial State ----

const DEFAULT_AKSESIBILITAS: PengaturanAksesibilitas = {
  volume: 0.7,
  ukuranTeks: "normal",
  kecepatanNarasi: 1,
  animasiDinonaktifkan: false,
};

const initialState: GameState = {
  profilAktif: null,
  semuaProfil: [],
  currentQuest: null,
  aksesibilitas: DEFAULT_AKSESIBILITAS,
};

// ---- Reducer (sync — UI state only) ----

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_PROFIL_AKTIF":
      return { ...state, profilAktif: action.payload };

    case "SET_SEMUA_PROFIL":
      return { ...state, semuaProfil: action.payload };

    case "UPDATE_PROGRES_QUEST": {
      if (!state.profilAktif) return state;
      const key = `quest${action.payload.questId}` as "quest1" | "quest2" | "quest3";
      const updatedProfil: ProfilSiswa = {
        ...state.profilAktif,
        progres: {
          ...state.profilAktif.progres,
          [key]: action.payload.progres,
          totalBintang:
            (key === "quest1" ? action.payload.progres.bintang : state.profilAktif.progres.quest1?.bintang ?? 0) +
            (key === "quest2" ? action.payload.progres.bintang : state.profilAktif.progres.quest2?.bintang ?? 0) +
            (key === "quest3" ? action.payload.progres.bintang : state.profilAktif.progres.quest3?.bintang ?? 0),
        },
      };
      return {
        ...state,
        profilAktif: updatedProfil,
        semuaProfil: state.semuaProfil.map((p) =>
          p.id === updatedProfil.id ? updatedProfil : p
        ),
      };
    }

    case "SET_CURRENT_QUEST":
      return { ...state, currentQuest: action.payload };

    case "UPDATE_AKSESIBILITAS": {
      const updated = { ...state.aksesibilitas, ...action.payload };
      setVolume(updated.volume);
      return { ...state, aksesibilitas: updated };
    }

    case "TAMBAH_STIKER": {
      if (!state.profilAktif) return state;
      if (state.profilAktif.progres.stiker.includes(action.payload)) return state;
      const updatedProfil: ProfilSiswa = {
        ...state.profilAktif,
        progres: {
          ...state.profilAktif.progres,
          stiker: [...state.profilAktif.progres.stiker, action.payload],
        },
      };
      return {
        ...state,
        profilAktif: updatedProfil,
        semuaProfil: state.semuaProfil.map((p) =>
          p.id === updatedProfil.id ? updatedProfil : p
        ),
      };
    }

    case "RESET_PROFIL": {
      const reset: ProfilSiswa | undefined = state.semuaProfil.find(
        (p) => p.id === action.payload
      );
      if (!reset) return state;
      const resetted: ProfilSiswa = {
        ...reset,
        jalur: null,
        progres: { quest1: null, quest2: null, quest3: null, stiker: [], totalBintang: 0 },
      };
      return {
        ...state,
        profilAktif:
          state.profilAktif?.id === action.payload ? resetted : state.profilAktif,
        semuaProfil: state.semuaProfil.map((p) =>
          p.id === action.payload ? resetted : p
        ),
      };
    }

    default:
      return state;
  }
}

// ---- Context Value ----

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // Async actions yang menyentuh SQLite
  actions: {
    saveProfilAktif: () => Promise<void>;
    updateQuestProgres: (questId: 1 | 2 | 3, progres: ProgresQuest) => Promise<void>;
    addStiker: (stikerId: string) => Promise<void>;
    resetProfilProgres: (profilId: string) => Promise<void>;
    deleteProfilById: (profilId: string) => Promise<void>;
    updateAksesibilitas: (data: Partial<PengaturanAksesibilitas>) => Promise<void>;
    refreshProfils: () => Promise<void>;
  };
}

const GameContext = createContext<GameContextValue | null>(null);

// ---- Provider ----

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Muat data dari SQLite saat mount
  useEffect(() => {
    (async () => {
      try {
        const [profils, aksesibilitas] = await Promise.all([
          getAllProfil(),
          getAksesibilitas(),
        ]);
        dispatch({ type: "SET_SEMUA_PROFIL", payload: profils });
        dispatch({ type: "UPDATE_AKSESIBILITAS", payload: aksesibilitas });

        // Pulihkan profil aktif dari sessionStorage
        const aktifId = getProfilAktifId();
        if (aktifId) {
          const aktif = profils.find((p) => p.id === aktifId);
          if (aktif) dispatch({ type: "SET_PROFIL_AKTIF", payload: aktif });
        }
      } catch (err) {
        console.warn("[GameContext] Gagal memuat data dari server:", err);
      }
    })();
  }, []);

  // ---- Async Actions ----

  const saveProfilAktif = useCallback(async () => {
    if (!state.profilAktif) return;
    try {
      const updated = await saveProfil(state.profilAktif);
      dispatch({ type: "SET_PROFIL_AKTIF", payload: updated });
    } catch (err) {
      console.error("[saveProfilAktif]", err);
    }
  }, [state.profilAktif]);

  const updateQuestProgres = useCallback(
    async (questId: 1 | 2 | 3, progres: ProgresQuest) => {
      if (!state.profilAktif) return;
      // Update UI langsung (optimistic)
      dispatch({ type: "UPDATE_PROGRES_QUEST", payload: { questId, progres } });
      // Persist ke SQLite
      try {
        const updated = await storageUpdateProgresQuest(state.profilAktif.id, questId, progres);
        if (updated) {
          dispatch({ type: "SET_PROFIL_AKTIF", payload: updated });
          dispatch({
            type: "SET_SEMUA_PROFIL",
            payload: state.semuaProfil.map((p) => (p.id === updated.id ? updated : p)),
          });
        }
      } catch (err) {
        console.error("[updateQuestProgres]", err);
      }
    },
    [state.profilAktif, state.semuaProfil]
  );

  const addStiker = useCallback(
    async (stikerId: string) => {
      if (!state.profilAktif) return;
      dispatch({ type: "TAMBAH_STIKER", payload: stikerId });
      try {
        await storageTambahStiker(state.profilAktif.id, stikerId);
      } catch (err) {
        console.error("[addStiker]", err);
      }
    },
    [state.profilAktif]
  );

  const resetProfilProgres = useCallback(
    async (profilId: string) => {
      dispatch({ type: "RESET_PROFIL", payload: profilId });
      try {
        await storageResetProgres(profilId);
      } catch (err) {
        console.error("[resetProfilProgres]", err);
      }
    },
    []
  );

  const deleteProfilById = useCallback(
    async (profilId: string) => {
      await storageDeleteProfil(profilId);
      dispatch({
        type: "SET_SEMUA_PROFIL",
        payload: state.semuaProfil.filter((p) => p.id !== profilId),
      });
      if (state.profilAktif?.id === profilId) {
        dispatch({ type: "SET_PROFIL_AKTIF", payload: null as unknown as ProfilSiswa });
      }
    },
    [state.semuaProfil, state.profilAktif]
  );

  const updateAksesibilitas = useCallback(
    async (data: Partial<PengaturanAksesibilitas>) => {
      dispatch({ type: "UPDATE_AKSESIBILITAS", payload: data });
      try {
        await saveAksesibilitas(data);
      } catch (err) {
        console.error("[updateAksesibilitas]", err);
      }
    },
    []
  );

  const refreshProfils = useCallback(async () => {
    try {
      const profils = await getAllProfil();
      dispatch({ type: "SET_SEMUA_PROFIL", payload: profils });
    } catch (err) {
      console.error("[refreshProfils]", err);
    }
  }, []);

  const actions = {
    saveProfilAktif,
    updateQuestProgres,
    addStiker,
    resetProfilProgres,
    deleteProfilById,
    updateAksesibilitas,
    refreshProfils,
  };

  return (
    <GameContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame harus digunakan di dalam GameProvider");
  return ctx;
}
