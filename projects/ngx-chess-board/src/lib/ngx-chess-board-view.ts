import { HistoryMove } from './history-move-provider/history-move';

export interface NgxChessBoardView {
    reset(): void;

    reverse(): void;

    undo(): void;

    getMoveHistory(): HistoryMove[];

    setFEN(fen: string): void;

    getFEN(): string;
}
