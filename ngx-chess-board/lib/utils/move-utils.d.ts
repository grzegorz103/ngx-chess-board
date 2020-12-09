import { Board } from '../models/board';
import { Color } from '../models/pieces/color';
import { Point } from '../models/pieces/point';
import { MoveTranslation } from '../models/move-translation';
export declare class MoveUtils {
    static willMoveCauseCheck(currentColor: Color, row: number, col: number, destRow: number, destCol: number, board: Board): boolean;
    static format(sourcePoint: Point, destPoint: Point, reverted: boolean): string;
    static translateCoordsToIndex(coords: string, reverted: boolean): MoveTranslation;
}
