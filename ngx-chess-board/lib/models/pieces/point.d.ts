export declare class Point {
    row: number;
    col: number;
    constructor(row: number, col: number);
    isEqual(that: Point): boolean;
    hasCoordsEqual(row: number, col: number): boolean;
}
