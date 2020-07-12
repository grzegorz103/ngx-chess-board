# ngx-chess-board
<img alt="npm" src="https://img.shields.io/npm/v/ngx-chess-board?color=success&label=npm%20package&logo=success&logoColor=success&style=plastic"> <img alt="CircleCI" src="https://img.shields.io/circleci/build/github/grzegorz103/ngx-chess-board?style=plastic">

ngx-chess-board is a project which allows to add chess game for two players on your site.

## Instalation
```bash
npm i ngx-chess-board
```

## Screenshots
![alt scr](https://i.imgur.com/IgPDO19.png)
![alt scr](https://i.imgur.com/z819ALt.png)

## Use example

`ngx-chess-board` exports 1 module.

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

```html
  constructor(private ngxChessBoardService: NgxChessBoardService) { }
```

## API

@Inputs()

Input | Type | Description    
| :---: | :---: | :---: |
`[size]` | number | Sets size of the chess board (in pixels). Default value is <b>400</b>
`[lightTileColor]` | string | Sets color of light tiles. Accepts predefined color names, RGB, HEX, HSL.
`[darkTileColor]` | string | Sets color of dark tiles. Accepts predefined color names, RGB, HEX, HSL.

@Outputs()

Name | Type | Description  
| :---: | :---: | :---: |
`(onMove)` | EventEmitter\<any> | Dispatch event when piece has moved

NgxChessBoardService methods

Method | Return type | Description
| :---: | :---: | :---: |
reset() | void | Resets chess board state
