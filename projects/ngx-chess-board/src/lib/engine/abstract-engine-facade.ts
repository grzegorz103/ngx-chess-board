import { PiecePromotionModalComponent } from '../piece-promotion/piece-promotion-modal/piece-promotion-modal.component';
import { HistoryMove } from '../history-move-provider/history-move';
import { HistoryMoveProvider } from '../history-move-provider/history-move-provider';
import { Board } from '../models/board';
import { King } from '../models/pieces/king';
import { Pawn } from '../models/pieces/pawn';
import { Piece } from '../models/pieces/piece';
import { Point } from '../models/pieces/point';
import { Rook } from '../models/pieces/rook';
import { Constants } from '../utils/constants';
import { PieceIconInputManager } from '../utils/inputs/piece-icon-input-manager';
import { ColorInput, PieceTypeInput } from '../utils/inputs/piece-type-input';
import { BoardLoader } from './board-state-provider/board-loader/board-loader';
import { CoordsProvider } from './coords/coords-provider';
import { DragEndStrategy } from './drag/end/drag-end-strategy';
import { DragStartStrategy } from './drag/start/drag-start-strategy';
import { ColorStrategy } from './drawing-tools/colors/color-strategy';
import { DrawProvider } from './drawing-tools/draw-provider';
import { DefaultPgnProcessor } from './pgn/default-pgn-processor';
import { AbstractPgnProcessor } from './pgn/abstract-pgn-processor';

export abstract class AbstractEngineFacade {

    public dragStartStrategy: DragStartStrategy = new DragStartStrategy();
    public dragEndStrategy: DragEndStrategy = new DragEndStrategy();
    public pgnProcessor: AbstractPgnProcessor = new DefaultPgnProcessor();
    protected colorStrategy: ColorStrategy = new ColorStrategy();

    public coords: CoordsProvider = new CoordsProvider();
    public heightAndWidth: number = Constants.DEFAULT_SIZE;

    public freeMode = false;
    public dragDisabled: boolean;
    public drawDisabled: boolean;
    public lightDisabled: boolean;
    public darkDisabled: boolean;
    public board: Board;
    public modal: PiecePromotionModalComponent;
    public boardLoader: BoardLoader;
    public drawProvider: DrawProvider = new DrawProvider();
    public pieceIconManager: PieceIconInputManager = new PieceIconInputManager();
    public moveHistoryProvider: HistoryMoveProvider = new HistoryMoveProvider();
    public moveDone: boolean;
    public disabling = false;

    protected constructor(board: Board) {
        this.board = board;
    }

    public abstract reset(): void;

    public abstract undo(): void;

    public abstract move(coords: string): void;

    public abstract addPiece(
        pieceTypeInput: PieceTypeInput,
        colorInput: ColorInput,
        coords: string
    ): void;

    public abstract onMouseUp(
        event: MouseEvent,
        pointClicked: Point,
        left: number,
        top: number
    ): void;

    public abstract onMouseDown(
        event: MouseEvent,
        pointClicked: Point,
        left?: number,
        top?: number
    ): void;

    public abstract onContextMenu(
        event: MouseEvent,
    ): void;

    public checkIfPawnFirstMove(piece: Piece) {
        if (piece instanceof Pawn) {
            piece.isMovedAlready = true;
        }
    }

    public checkIfRookMoved(piece: Piece) {
        if (piece instanceof Rook) {
            piece.isMovedAlready = true;
        }
    }

    public checkIfKingMoved(piece: Piece) {
        if (piece instanceof King) {
            piece.isMovedAlready = true;
        }
    }

    public getMoveHistory(): HistoryMove[] {
        return this.moveHistoryProvider.getAll();
    }

}
