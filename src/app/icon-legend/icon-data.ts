import { IconNames } from './icon-names';
import { IconEnum } from './icon-enum';

export enum IconAction {
  Execute,
  ReduceTo,
  Show,
  Hide,
  Toggle,
  Increment,
  Decrement,
  Find,
  Display,
  DisplayAndFind,
}

export enum IconColor {
  Normal,
  Primary,
  Accent,
  Warn,
}

export class IconData {
  EnumValue: IconEnum;
  Meaning: string;
  Action: IconAction;
  Color: IconColor;
  Method: string;

  get Name(): string {
    return IconNames[this.EnumValue];
  }

  get IconColorString(): string {
    switch (this.Color) {
      case IconColor.Normal:
        return '';
      case IconColor.Primary:
        return 'primary';
      case IconColor.Accent:
        return 'accent';
      case IconColor.Warn:
        return 'warn';
      default:
        return 'primary';
    }
  }

  get IconActionString(): string {
    switch (this.Action) {
      case IconAction.Execute:
        return 'Execute';
      case IconAction.ReduceTo:
        return 'Reduce To';
      case IconAction.Show:
        return 'Show';
      case IconAction.Hide:
        return 'Hide';
      case IconAction.Toggle:
        return 'Toggle';
      case IconAction.Increment:
        return 'Increment';
      case IconAction.Decrement:
        return 'Decrement';
      case IconAction.Find:
        return 'Find';
      case IconAction.Display:
        return 'Display';
      case IconAction.DisplayAndFind:
        return 'Display and Find';
      default:
        return '';
    }
  }

  static readIconData(source: (string | IconEnum | IconColor | IconAction)[][]) {
    const a: IconData[] = [];
    for (const cr of source) {
      const id: IconData = new IconData();
      id.EnumValue = cr[0] as IconEnum;
      id.Meaning = cr[1] as string;
      id.Action = cr[2] as IconAction;
      id.Color = cr[3] as IconColor;
      if (cr.length === 5) {
        id.Method = cr[4] as string;
      }
      a.push(id);
    }
    return a;
  }
}

export const ToolbarIcons = [
  [IconEnum.touch_app, 'Input', IconAction.Toggle, IconColor.Normal, ''],
  [IconEnum.event, 'Event', IconAction.ReduceTo, IconColor.Normal, ''],
  [IconEnum.person, 'Bib', IconAction.ReduceTo, IconColor.Normal, ''],
  [IconEnum.texture, 'None', IconAction.ReduceTo, IconColor.Normal, ''],
  [IconEnum.help, 'Help', IconAction.Toggle, IconColor.Normal, ''],
];

export const EventNavIcons = [
  [IconEnum.chevron_left, 'Race down', IconAction.Decrement, IconColor.Normal, ''],
  [IconEnum.directions_run, 'Race', IconAction.DisplayAndFind, IconColor.Normal, ''],
  [IconEnum.chevron_right, 'Race up', IconAction.Increment, IconColor.Normal, ''],

  [IconEnum.chevron_left, 'Bib down', IconAction.Decrement, IconColor.Normal, ''],
  [IconEnum.person, 'Bib', IconAction.DisplayAndFind, IconColor.Normal, ''],
  [IconEnum.chevron_right, 'Bib up', IconAction.Increment, IconColor.Normal, ''],
];

export const ConfigIcons = [
  [IconEnum.ac_unit, 'Event Params form', IconAction.ReduceTo, IconColor.Primary, ''],
  [IconEnum.settings, 'Event Properties form', IconAction.ReduceTo, IconColor.Primary, ''],
  [IconEnum.event, 'Event', IconAction.ReduceTo, IconColor.Normal, ''],
];

export const CommandIcons = [
  [IconEnum.replay, 'Load from local storage', IconAction.Execute, IconColor.Accent, ''],
  [IconEnum.save, 'Save to local storage', IconAction.Execute, IconColor.Accent, ''],
  [IconEnum.rowing, 'Race Enabled', IconAction.Toggle, IconColor.Accent, ''],
  [IconEnum.delete_outline, 'Clear Timepoint', IconAction.Execute, IconColor.Accent, ''],
  [IconEnum.delete, 'Clear Race', IconAction.Execute, IconColor.Accent, ''],
  [IconEnum.delete_forever, 'Clear', IconAction.Execute, IconColor.Accent, ''],
  [IconEnum.redo, 'Update Event', IconAction.Execute, IconColor.Accent, ''],
];

export const CardToggleIcons = [
  [IconEnum.dashboard, 'Panel', IconAction.Toggle, IconColor.Primary, 'toggleButtonPanel()'],
  [IconEnum.maximize, 'Explorer Line', IconAction.Toggle, IconColor.Accent, ''],
  [IconEnum.explore, 'Explorer Bar', IconAction.Toggle, IconColor.Primary, 'toggleExplorerBar()'],
  [IconEnum.functions, 'Command Bar', IconAction.Toggle, IconColor.Accent, ''],
];

export const TabToggleIcons = [
  [IconEnum.camera, 'Legend Tab', IconAction.Toggle, IconColor.Primary, ''],
  [IconEnum.gesture, 'Json Tab', IconAction.Toggle, IconColor.Primary, ''],
  [IconEnum.edit, 'Text Area Tab', IconAction.Toggle, IconColor.Primary, ''],
  [IconEnum.gesture, 'Pre Text Tab', IconAction.Toggle, IconColor.Primary, ''],
  [IconEnum.style, 'Config Tab', IconAction.Toggle, IconColor.Primary, ''],
  // [IconEnum.category, 'Components Tab', IconAction.Toggle, IconColor.Primary, ''],
  [IconEnum.landscape, 'Sonstiges Tab', IconAction.Toggle, IconColor.Primary, ''],
];

export const OptionToggleIcons = [
  [IconEnum.pets, 'Big Button Row', IconAction.Toggle, IconColor.Normal, ''],
  [IconEnum.all_inclusive, 'Debug', IconAction.Toggle, IconColor.Normal, ''],
];

export const ComponentToggleIcons = [
  [IconEnum.local_library, 'Assets', IconAction.Toggle, IconColor.Primary, ''],
  [IconEnum.cloud, 'Event Menu', IconAction.Toggle, IconColor.Primary, ''],
  [IconEnum.archive, 'Save Event Data', IconAction.Toggle, IconColor.Primary, ''],
  [IconEnum.unarchive, 'Load Event Data', IconAction.Toggle, IconColor.Primary, ''],
  [IconEnum.link, 'Connection Bar', IconAction.Toggle, IconColor.Primary, ''],
];

export const CheckbarIcons = [
  [IconEnum.cached, 'Try Toggle Strict', IconAction.Execute, IconColor.Normal, 'tryToggleStrict()'],
];

export const EditbarIcons = [
  [IconEnum.attachment, 'Process Queue', IconAction.Execute, IconColor.Normal, 'processQueue()'],
  [IconEnum.clear, 'Clear Queue', IconAction.Execute, IconColor.Accent, 'clearQueue()'],
  [IconEnum.attach_file, 'Use Queue', IconAction.Toggle, IconColor.Accent, 'toggleUseQueue()'],
  [IconEnum.toys, 'gen msg for bib', IconAction.Execute, IconColor.Primary, 'generateMsg()'],
  [IconEnum.camera, 'toggle legend', IconAction.Toggle, IconColor.Normal, 'toggleInputLegend()'],
];

export const TextAreaIcons = [
  [IconEnum.clear, 'clear', IconAction.Hide, IconColor.Normal, 'memoClear()'],
  [
    IconEnum.input,
    'last loaded asset data, if any',
    IconAction.Show,
    IconColor.Normal,
    'memoAsset()',
  ],
  [IconEnum.input, 'converted data', IconAction.Show, IconColor.Primary, 'memoConvertedData()'],
  [IconEnum.save, 'normal text', IconAction.Show, IconColor.Normal, 'memoText(false)'],
  [IconEnum.save, 'compact text', IconAction.Show, IconColor.Primary, 'memoText(false)'],
  [
    IconEnum.send,
    'read data and create new event',
    IconAction.Execute,
    IconColor.Accent,
    'memoText(true)',
  ],
  [IconEnum.share, 'copy to clipboard', IconAction.Execute, IconColor.Normal, 'memoCopy(memo)'],
  [IconEnum.camera, 'toggle legend', IconAction.Toggle, IconColor.Normal, 'toggleTextAreaLegend()'],
];

export const PreTextIcons = [
  [IconEnum.clear, 'clear', IconAction.Hide, IconColor.Normal, 'clearTextOutput()'],
  [IconEnum.input, 'converted data', IconAction.Show, IconColor.Normal, 'showConvertedData()'],
  [IconEnum.wb_sunny, 'queue content', IconAction.Show, IconColor.Accent, 'showQueue()'],
  [IconEnum.save, 'normal text', IconAction.Show, IconColor.Normal, 'getTxtBackup(false)'],
  [IconEnum.save, 'compact text', IconAction.Show, IconColor.Primary, 'getTxtBackup(true)'],
  [IconEnum.share, 'copy compact text', IconAction.Execute, IconColor.Primary, 'copyCompact()'],
  [IconEnum.camera, 'toggle legend', IconAction.Toggle, IconColor.Normal, 'togglePreTextLegend()'],
];

export const EventIcons = [
  [
    IconEnum.flag,
    'show finish positions in race columns',
    IconAction.Show,
    IconColor.Primary,
    'setLayout(1)',
  ],
  [
    IconEnum.scatter_plot,
    'show points in race columns',
    IconAction.Show,
    IconColor.Normal,
    'setLayot(0)',
  ],
  [IconEnum.brush, 'white cell background', IconAction.Show, IconColor.Normal, 'colorBtnClick(1)'],
  [
    IconEnum.brush,
    'default color mode, will indicate errors',
    IconAction.Show,
    IconColor.Primary,
    'colorBtnClick(2)',
  ],
  [
    IconEnum.brush,
    'fleet color mode, shows fleet assignment',
    IconAction.Show,
    IconColor.Accent,
    'colorBtnClick(3)',
  ],
  [IconEnum.camera, 'toggle legend', IconAction.Toggle, IconColor.Normal, 'toggleLegend()'],
];
