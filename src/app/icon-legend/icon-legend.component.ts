import { Component } from '@angular/core';
import { TBOManager } from '../../bo/bo-manager';
import {
  IconData,
  IconbarIcons,
  ToolbarIcons,
  PreTextIcons,
  TextAreaIcons,
  EditbarIcons,
  EventIcons,
} from './icon-data';

@Component({
  selector: 'app-icon-legend',
  templateUrl: './icon-legend.component.html',
  styleUrls: ['./icon-legend.component.css']
})
export class IconLegendComponent {

  toolbarIcons: IconData[];
  iconbarIcons: IconData[];
  editbarIcons: IconData[];
  textAreaIcons: IconData[];
  preTextIcons: IconData[];
  eventIcons: IconData[];

  constructor(public BOManager: TBOManager) {
    this.toolbarIcons = IconData.readIconData(ToolbarIcons);
    this.iconbarIcons = IconData.readIconData(IconbarIcons);
    this.editbarIcons = IconData.readIconData(EditbarIcons);
    this.textAreaIcons = IconData.readIconData(TextAreaIcons);
    this.preTextIcons = IconData.readIconData(PreTextIcons);
    this.eventIcons = IconData.readIconData(EventIcons);
  }

}
