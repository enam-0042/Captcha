import { create } from "zustand";
import { CaptureInterface } from "./types";

interface CaptureStateInterface {
  data: CaptureInterface;
  setData: (arg: CaptureInterface) => void;
  resetData: () => void;
}

export const useImageDataStore = create<CaptureStateInterface>((set) => ({
  data: {}, // initial state
  setData: (arg) => set((state) => ({ data: { ...state.data, ...arg } })),
  resetData: () => set(() => ({ data: {} })),
}));
