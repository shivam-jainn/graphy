import { atom } from 'jotai';

export const selectedBoardAtom = atom<string | null>(null);
export const selectedChatAtom = atom<string | null>(null);