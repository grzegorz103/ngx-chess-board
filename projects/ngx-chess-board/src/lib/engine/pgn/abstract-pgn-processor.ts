import { Board } from '../../models/board';
import { Piece } from '../../models/pieces/piece';
import { Point } from '../../models/pieces/point';

export abstract class AbstractPgnProcessor {

    protected pgn = [];
    protected currentIndex = 0.5;

    public abstract process(
        board: Board,
        sourcePiece: Piece,
        destPoint: Point,
        destPiece?: Piece
    ): void;

    public getPGN() {
        return this.pgn.join(' ');
    }

    protected getLast() {
        return this.pgn[this.pgn.length - 1];
    }

    protected appendToLast(str: string) {
        this.pgn[this.pgn.length - 1] = this.getLast() + str;
    }

    processChecks(checkmate: boolean, check: boolean, stalemate: boolean) {
        if (checkmate) {
            this.appendToLast('#');
        } else {
            if (check) {
                this.appendToLast('+');
            }
        }
    }

    reset() {
        this.pgn = [];
        this.currentIndex = 0.5;
    }

    addPromotionChoice(promotion: string) {
        switch (promotion) {
            case "q":
                this.appendToLast('=Q');
                break;
            case "r":
                this.appendToLast('=R');
                break;
            case "b":
                this.appendToLast('=B');
                break;
            case "n":
                this.appendToLast('=N');
                break;
        }
    }

    removeLast() {
        this.pgn.pop();
        this.currentIndex -= 0.5;
    }

}
