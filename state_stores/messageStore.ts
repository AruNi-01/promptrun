import { create } from "zustand";

interface IMessageNotReadCountState {
  messageNotReadCount: number;
  setMessageNotReadCount: (count: number) => void;
}
export const useMessageNotReadCountState = create<IMessageNotReadCountState>((set) => ({
  messageNotReadCount: 0,
  setMessageNotReadCount: (count: number) => set({ messageNotReadCount: count }),
}));
