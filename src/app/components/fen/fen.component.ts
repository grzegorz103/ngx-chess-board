import { ChangeDetectionStrategy, Component, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'app-fen',
    templateUrl: './fen.component.html',
    styleUrls: ['./fen.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FenComponent {
    @Input() fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    @Input() fenChange = new EventEmitter<string>();
}
