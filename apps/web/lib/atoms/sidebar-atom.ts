import { atom } from 'jotai';

export const isSidebarOpenAtom = atom(true);

export const selectedBoardAtom = atom<number>(0);