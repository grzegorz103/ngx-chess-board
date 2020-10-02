import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsComponent {
    @Output() public undo = new EventEmitter<void>();
    @Output() public reverse = new EventEmitter<void>();
    @Output() public restart = new EventEmitter<void>();
    @Output() public latest = new EventEmitter<void>();
}
