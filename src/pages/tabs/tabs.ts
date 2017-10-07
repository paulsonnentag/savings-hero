import { Component } from '@angular/core';

import { QuestPage } from '../quest/quest';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  homeRoot = HomePage;
  questRoot = QuestPage;

  constructor() {

  }
}
