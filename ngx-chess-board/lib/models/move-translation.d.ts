export declare class MoveTranslation {
    private _xAxis;
    private _yAxis;
    private _reverted;
    constructor(xAxis: number, yAxis: number, reverted: boolean);
    get xAxis(): number;
    set xAxis(value: number);
    get yAxis(): number;
    set yAxis(value: number);
    get reverted(): boolean;
    set reverted(value: boolean);
}
