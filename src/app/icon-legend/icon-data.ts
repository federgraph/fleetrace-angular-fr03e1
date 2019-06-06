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
    DisplayAndFind
}

export enum IconColor {
    Normal,
    Primary,
    Accent,
    Warn
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
            case IconColor.Normal: return '';
            case IconColor.Primary: return 'primary';
            case IconColor.Accent: return 'accent';
            case IconColor.Warn: return 'warn';
            default: return 'primary';
        }
    }

    get IconActionString(): string {
        switch (this.Action) {
            case IconAction.Execute: return 'Execute';
            case IconAction.ReduceTo: return 'Reduce To';
            case IconAction.Show: return 'Show';
            case IconAction.Hide: return 'Hide';
            case IconAction.Toggle: return 'Toggle';
            case IconAction.Increment: return 'Increment';
            case IconAction.Decrement: return 'Decrement';
            case IconAction.Find: return 'Find';
            case IconAction.Display: return 'Display';
            case IconAction.DisplayAndFind: return 'Display and Find';
            default: return '';
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

export const IconbarIcons = [
    [IconEnum.camera, 'Icon Legend', IconAction.Toggle, IconColor.Primary, ''],
    [IconEnum.ac_unit, 'Event Params form', IconAction.ReduceTo, IconColor.Primary, ''],
    [IconEnum.settings, 'Event Properties form', IconAction.ReduceTo, IconColor.Primary, ''],
    [IconEnum.format_align_justify, 'Pre Text', IconAction.ReduceTo, IconColor.Primary, ''],
    [IconEnum.edit, 'Text Area', IconAction.ReduceTo, IconColor.Primary, ''],
    [IconEnum.gesture, 'Json Info', IconAction.ReduceTo, IconColor.Primary, ''],
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
    [IconEnum.input, 'last loaded asset data, if any', IconAction.Show, IconColor.Normal, 'memoAsset()'],
    [IconEnum.input, 'converted data', IconAction.Show, IconColor.Primary, 'memoConvertedData()'],
    [IconEnum.save, 'normal text', IconAction.Show, IconColor.Normal, 'memoText(false)'],
    [IconEnum.save, 'compact text', IconAction.Show, IconColor.Primary, 'memoText(false)'],
    [IconEnum.send, 'read data and create new event', IconAction.Execute, IconColor.Accent, 'memoText(true)'],
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
    [IconEnum.flag, 'show finish positions in race columns', IconAction.Show, IconColor.Primary, 'setLayout(1)'],
    [IconEnum.scatter_plot, 'show points in race columns', IconAction.Show, IconColor.Normal, 'setLayot(0)'],
    [IconEnum.brush, 'white cell background', IconAction.Show, IconColor.Normal, 'colorBtnClick(1)'],
    [IconEnum.brush, 'default color mode, will indicate errors', IconAction.Show, IconColor.Primary, 'colorBtnClick(2)'],
    [IconEnum.brush, 'fleet color mode, shows fleet assignment', IconAction.Show, IconColor.Accent, 'colorBtnClick(3)'],
    [IconEnum.camera, 'toggle legend', IconAction.Toggle, IconColor.Normal, 'toggleLegend()'],
];
