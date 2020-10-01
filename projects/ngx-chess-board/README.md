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
![alt scr](https://i.imgur.com/647jzkp.png)
![alt scr](https://i.imgur.com/qdX6zpj.png)

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
    NgxChessBoardModule.forRoot()
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
`[dragDisabled]` | boolean | Specifies whether piece dragging is disabled. Default value is <b>false</b>
`[drawDisabled]` | boolean|  Specifies whether drawing with right mouse button is disabled. Default value is <b>false</b>
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
