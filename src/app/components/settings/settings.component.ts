import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
    @Output() public darkChange = new EventEmitter<string>();
    @Output() public lightChange = new EventEmitter<string>();
    @Output() public sizeChange = new EventEmitter<number>();
    @Output() public dragDisabledChange = new EventEmitter<void>();
    @Output() public drawDisabledChange = new EventEmitter<void>();

    public darkTileColor = 'rgb(97, 84, 61)';
    public lightTileColor = '#BAA378';
    public size = 500;
    public dragDisabled = false;
    public drawDisabled = false;
}
