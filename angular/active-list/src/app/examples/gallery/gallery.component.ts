import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActiveList } from '@uiloos/core';
import { GalleryImage } from './types';

@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class GalleryComponent implements OnInit {
  @Input() images!: GalleryImage[];

  public gallery!: ActiveList<GalleryImage>;

  ngOnInit(): void {
    const self = this;

    this.gallery = new ActiveList({
      contents: this.images,
      active: this.images[0],
    });
  }
}
