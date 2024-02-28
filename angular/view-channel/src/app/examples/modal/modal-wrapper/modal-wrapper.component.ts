import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { ViewChannelView } from '@uiloos/core';
import { modalCancelled } from '../modal.service';
import { ModalData } from '../types';
import { ModalLoaderDirective } from '../modal-loader.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'modal-wrapper',
  templateUrl: './modal-wrapper.component.html',
  styleUrls: ['./modal-wrapper.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ModalLoaderDirective
  ]
})
export class ModalWrapperComponent implements OnInit {
  @Input() view!: ViewChannelView<ModalData<any>, any>;

  @ViewChild(ModalLoaderDirective, { static: true })
  modalLoader!: ModalLoaderDirective;

  ngOnInit() {
    const Component = this.view.data.component;

    // Programmatically instantiate the given Component
    const component = this.modalLoader.viewContainerRef.createComponent(
      Component
    );

    // Now set the props so the modal works
    component.instance.view = this.view;
    component.instance.data = this.view.data.data;
  }

  @HostListener('document:keydown.escape')
  onCancelClicked() {
    this.view.dismiss(modalCancelled);
  }
}
