export declare class CoordsProvider {
    private readonly defaultXCoords;
    private readonly defaultYCoords;
    private currentXCoords;
    private currentYCoords;
    get xCoords(): string[];
    get yCoords(): number[];
    reverse(): void;
    reset(): void;
    private init;
}
