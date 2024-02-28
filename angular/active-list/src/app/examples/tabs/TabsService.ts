import { Injectable } from '@angular/core';
import { ActiveList } from '@uiloos/core';
import { TabInfo } from './types';

@Injectable()
export class TabsService {
  public tabs = new ActiveList<TabInfo>({});
}
