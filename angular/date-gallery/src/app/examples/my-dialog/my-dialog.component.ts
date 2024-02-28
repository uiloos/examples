import {
  Component,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'my-dialog',
  templateUrl: './my-dialog.component.html',
  standalone: true,
})
export class MyDialogComponent implements AfterViewInit {
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

  @Output() close = new EventEmitter<void>();

  ngAfterViewInit() {
    this.dialog.nativeElement.showModal();
  }

  public closeDialog(event: Event) {
    if (
      event.target instanceof HTMLElement &&
      event.target.nodeName === 'DIALOG'
    ) {
      this.dialog.nativeElement.close();
      this.close.emit();
    }
  }
}
