# ngx-chess-board
<img alt="npm" src="https://img.shields.io/npm/v/ngx-chess-board?color=success&label=npm%20package&logo=success&logoColor=success&style=plastic"> <img alt="CircleCI" src="https://img.shields.io/circleci/build/github/grzegorz103/ngx-chess-board?style=plastic">

ngx-chess-board is a project which allows to add chess game for two players on your site.

## Instalation
```bash
npm i ngx-chess-board
```

## Screenshots
![alt scr](https://i.imgur.com/IgPDO19.png)
![alt scr](https://i.imgur.com/W4rSOya.png)

## Use example

`ngx-chess-board` exports 1 module.

```typescript
import {
  NgxChessBoardModule
} from "ngx-chess-board";

...
@NgModule({
  ...
  imports: [
    ...
    NgxChessBoardModule,
    ...
   ],
   ...
})
export class AppModule { }
```
Next, add following tag in your component's view to render the chess board.
```html
<ngx-chess-board></ngx-chess-board>
```

## API

@Inputs()

Input | Type | Description    
| :---: | :---: | :---: |
size | number | Sets size of the chess board (in pixels). Default value is <b>400</b>
