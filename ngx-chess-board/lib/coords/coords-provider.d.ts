export declare class CoordsProvider {
    private defaultXCoords;
    private reversedXCoords;
    private defaultYCoords;
    private reversedYCoords;
    private currentXCoords;
    private currentYCoords;
    get xCoords(): string[];
    get yCoords(): number[];
    reverse(): void;
    reset(): void;
    private init;
}
