import {Component, Input} from '@angular/core';
import {NgxChessBoardService} from 'ngx-chess-board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-chess-board demo';

  darkTileColor: string = 'rgb(97, 84, 61)';
  lightTileColor: string = '#BAA378';

  constructor(private ngxService: NgxChessBoardService) {
  }

  reset() {
    this.ngxService.reset();
  }

}
