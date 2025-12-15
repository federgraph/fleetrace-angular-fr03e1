import { Component, inject } from '@angular/core';
import { TBOManager } from '../../bo/bo-manager';
import {
  IconData,
  ToolbarIcons,
  CardToggleIcons,
  TabToggleIcons,
  OptionToggleIcons,
  ComponentToggleIcons,
  CommandIcons,
  PreTextIcons,
  TextAreaIcons,
  EditbarIcons,
  EventIcons,
} from './icon-data';
import { IconBarLegendComponent } from '../icon-bar-legend/icon-bar-legend.component';
import { MaterialModule } from '../material/material.module';

@Component({
  selector: 'app-icon-legend',
  imports: [MaterialModule, IconBarLegendComponent],
  templateUrl: './icon-legend.component.html',
  styleUrls: ['./icon-legend.component.css'],
})
export class IconLegendComponent {
  toolbarIcons: IconData[];
  cardToggleIcons: IconData[];
  tabToggleIcons: IconData[];
  optionToggleIcons: IconData[];
  componentToggleIcons: IconData[];
  commandIcons: IconData[];
  editbarIcons: IconData[];
  textAreaIcons: IconData[];
  preTextIcons: IconData[];
  eventIcons: IconData[];

  public BOManager = inject(TBOManager);

  constructor() {
    this.toolbarIcons = IconData.readIconData(ToolbarIcons);
    this.cardToggleIcons = IconData.readIconData(CardToggleIcons);
    this.tabToggleIcons = IconData.readIconData(TabToggleIcons);
    this.optionToggleIcons = IconData.readIconData(OptionToggleIcons);
    this.componentToggleIcons = IconData.readIconData(ComponentToggleIcons);
    this.commandIcons = IconData.readIconData(CommandIcons);
    this.editbarIcons = IconData.readIconData(EditbarIcons);
    this.textAreaIcons = IconData.readIconData(TextAreaIcons);
    this.preTextIcons = IconData.readIconData(PreTextIcons);
    this.eventIcons = IconData.readIconData(EventIcons);
  }
}
