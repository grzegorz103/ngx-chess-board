# ngx-chess-board
<img alt="npm" src="https://img.shields.io/npm/v/ngx-chess-board?color=success&label=npm%20package&logo=success&logoColor=success&style=plastic"> <img alt="CircleCI" src="https://img.shields.io/circleci/build/github/grzegorz103/ngx-chess-board?style=plastic">

ngx-chess-board is a project which allows to add chess game for two players on your site.

## Instalation
```bash
npm i ngx-chess-board
```

## Demo
See [demo version](https://grzegorz103.github.io/ngx-chess-board/chess-board/index.html)

## Screenshots
![alt scr](https://i.ibb.co/NsRx0Pj/image.png)
![alt scr](https://i.ibb.co/b6ryJmP/image.png)

## Use example

`ngx-chess-board` exports following components:
* `NgxChessBoardModule`
* `NgxChessBoardService`
* `NgxChessBoardView`

To start, you have to import the `NgxChessBoardModule`:
```typescript
import { NgxChessBoardModule } from "ngx-chess-board";

...
@NgModule({
  ...
  imports: [
    ...
    NgxChessBoardModule
    ...
   ],
   ...
})
export class AppModule { }
```
Next, add following tag in your component's view to render the chess board:
```html
<ngx-chess-board></ngx-chess-board>
```

Then you can inject NgxChessBoardService into your component:

```typescript
import {NgxChessBoardService} from 'ngx-chess-board';

  ...

  constructor(private ngxChessBoardService: NgxChessBoardService) { }
```

You can add reference to `NgxChessBoardView` to interact with specified chess board:
HTML file:
```html
<ngx-chess-board #board></ngx-chess-board>
```
.ts file:
```typescript
import {NgxChessBoardView} from 'ngx-chess-board';

   ...

@ViewChild('board', {static: false}) board: NgxChessBoardView;

   ...

    reset() {
        this.board.reset();
    }

   ...
```


## API

#### @Inputs()

Input | Type | Description    
| :---: | :---: | :---: |
`[size]` | number | Sets size of the chess board (in pixels). Default value is <b>400</b>. Size must be in range between 100-4000.
`[lightTileColor]` | string | Sets color of light tiles. Accepts predefined color names, RGB, HEX, HSL.
`[darkTileColor]` | string | Sets color of dark tiles. Accepts predefined color names, RGB, HEX, HSL.
`[showCoords]` | boolean | Sets visibility of coordination bar. Default value is <b>true</b>
`[sourcePointColor]` | string | Sets background color for the source box from where the piece is moved.
`[destinationPointColor]` | string | Sets background color for the destination box where the piece is dropped.
`[showLastMove]` | boolean | Specifies whether the last move should be highlighted or not.
`[showLegalMoves]` | boolean | Specifies whether the legal moves should be highlighted or not.
`[dragDisabled]` | boolean | Specifies whether piece dragging is disabled. Default value is <b>false</b>
`[drawDisabled]` | boolean|  Specifies whether drawing with right mouse button is disabled. Default value is <b>false</b>
`[lightDisabled]` | boolean | Specifies whether light pieces are disabled to move. Default value is <b>false</b>
`[darkDisabled]` | boolean | Specifies whether dark pieces are disabled to move. Default value is <b>false</b>        
`[pieceIcons]` | PieceIconInput | Sets custom piece icons. Accepts SVG, IMG. Default the ASCII icons are used.
`[freeMode]` | boolean | Sets the board in free mode. In this mode pieces can be moved freely, even to tiles that aren't in possible moves or possible captures.
`[showActivePiece]` | boolean | Specifies whether active piece clicked has to be highlighted.  Default value is true
`[showPossibleCaptures]` | boolean | Specifies whether possible captures have to be highlighted. Default value is true
<hr>

#### Outputs

Name | Type | Description  
| :---: | :---: | :---: |
`(moveChange)` | EventEmitter\<any> | Dispatch event when piece has moved
<hr>

#### NgxChessBoardView methods

Method | Return type | Description
| :---: | :---: | :---: |
reset() | void | Resets specified chess game
reverse() | void | Reverse specified chess board
undo() | void | Undo the last move
getMoveHistory() | JSON | Returns array in JSON format which contains information about every move
setFEN(fen: string) | void | Allows to import specified board position by FEN
getFEN() | string | Returns current board FEN position
move(coords: string) | void | Makes move by specified coords. The coords parameter contains source and destination position e.g. 'd2d4'.
addPiece(pieceTypeInput: PieceTypeInput, colorInput: ColorInput, coords: string) | void | Adds new piece to the board at specified square, e.g. 'd4'. Left click on a piece with control removes piece. Free mode must be enabled first. 
setPGN(coords:string) | void | Imports board position in PGN notation 
getPGN() | string | Returns current board position in PGN notation 
