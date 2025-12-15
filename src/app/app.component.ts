import { Component, ViewChild, ChangeDetectorRef, OnInit, inject } from '@angular/core';

import { BibComponent } from './bib/bib.component';
import { EventComponent } from './event/event.component';
import { TBOManager } from '../bo/bo-manager';
import { IEventDataItem, TEventDataAsset } from './shared/test-data';
import { TStringList } from '../util/fb-strings';
import { TimingButtonsComponent } from './timing-buttons/timing-buttons.component';
import { EventProps, EventParams } from './shared/data-model';
import { TExcelExporter } from '../fr/fr-excel-export';
import { TableID } from '../fr/fr-excel-importer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentNumbers } from '../fr/fr-bo';
import { IconData, PreTextIcons, TextAreaIcons } from './icon-legend/icon-data';
import { ConnectionControlComponent } from './connection-control/connection-control.component';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconBarLegendComponent } from './icon-bar-legend/icon-bar-legend.component';
import { HelpComponent } from './help/help.component';
import { FeaturedEventComponent } from './featured-event/featured-event.component';
import { ResultHashComponent } from './result-hash/result-hash.component';
import { ResultUploadComponent } from './result-upload/result-upload.component';
import { ApiComponent } from './api/api.component';
import { FormEventParamsQuickComponent } from './form-event-params-quick/form-event-params-quick.component';
import { FormEventPropsQuickComponent } from './form-event-props-quick/form-event-props-quick.component';
import { JsonInfoComponent } from './json-info/json-info.component';
import { IconLegendComponent } from './icon-legend/icon-legend.component';

enum Page {
  None,
  Bib,
  Input,
  Race,
  Event,
  Params,
  Props,
  TextArea,
  PreText,
  HelpText,
  JsonInfo,
  Legend,
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    HelpComponent,
    HelpComponent,
    FeaturedEventComponent,
    ResultHashComponent,
    ResultUploadComponent,
    FormEventParamsQuickComponent,
    FormEventPropsQuickComponent,
    JsonInfoComponent,
    IconLegendComponent,
    IconBarLegendComponent,
    TimingButtonsComponent,
    BibComponent,
    EventComponent,
    ConnectionControlComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'FREO';

  wantInput = false;
  wantOutput = false;

  lastWebSocketMsg = 'LastWebSocketMsg';

  autoSaveParamsKey = 'fr-app-params';
  autoSaveOptionsKey = 'fr-app-options';
  autoSaveDataKey = 'fr-app-data';

  CurrentPage: Page = Page.Event;

  Throwouts = 0;

  MemoText = '';
  TestOutput = '';

  ShortMode = true;

  RowsVisible = false;

  TableRowVisible = false;
  ThrowoutsRowVisible = false;
  ClearingRowVisible = false;

  LinkButtonVisible = false;

  ApiVisible = false;
  ConnVisible = false;

  ComponentToggleCardVisible = false;
  CommandBarVisible = true;
  ExplorerBarVisible = false;
  ExplorerLineVisible = false;
  ButtonPanelVisible = true;

  InputVisible = true;
  BibVisible = false;
  EntriesVisible = false;
  RaceVisible = false;
  EventVisible = true;

  TextAreaLegendVisible = true;
  PreTextLegendVisible = true;

  TextAreaVisible = true;
  PreTextVisible = true;
  HelpTextVisible = true;
  JsonInfoVisible = true;
  LegendVisible = true;
  ConfigVisible = false;
  ComponentsVisible = false;
  SonstigesVisible = false;

  ParamsVisible = false;
  PropsVisible = false;

  TabsVisible = false;

  @ViewChild('eventTab', { static: false }) eventTab: EventComponent;
  @ViewChild('timingTab', { static: false }) timingTab: TimingButtonsComponent;
  @ViewChild('bibInfo', { static: false }) bibTab: BibComponent;
  @ViewChild('connBar', { static: false }) connBar: ConnectionControlComponent;

  private SL: TStringList;
  private Asset: IEventDataItem;

  textAreaIcons: IconData[];
  preTextIcons: IconData[];
  ConnectionBarVisible: any;

  private cdref = inject(ChangeDetectorRef);
  public BOManager = inject(TBOManager);
  public snackBar = inject(MatSnackBar);

  constructor() {
    this.BOManager.BigButtonRow = false;
    this.BOManager.IsDebug = false;
    this.SL = new TStringList();
    this.Asset = new TEventDataAsset();
    this.updateThrowouts();
    this.BOManager.BO.updateStrictInputMode();
    this.BOManager.BO.EventProps.EventName = 'Event Name';
    this.initCurrent();
    this.textAreaIcons = IconData.readIconData(TextAreaIcons);
    this.preTextIcons = IconData.readIconData(PreTextIcons);
  }

  ngOnInit() {
    this.initParams();
  }

  autoLoad() {
    const t = localStorage.getItem(this.autoSaveDataKey);
    if (t === undefined) {
      // do nothing
    } else if (t === null) {
      // do nothing
    } else if (t === '') {
      // do nothing
    } else {
      const edi = new IEventDataItem();
      edi.EventData = t;
      edi.EventName = '';
      this.NewEventData = edi;
    }
  }

  autoSave() {
    const SL = new TStringList();
    this.BOManager.BO.BackupToSLCompact(SL, true);
    localStorage.setItem(this.autoSaveDataKey, SL.Text);
  }

  get EventName(): string {
    return this.BOManager.BO.EventProps.EventName;
  }

  updateThrowouts(): void {
    this.Throwouts = this.BOManager.BO.EventProps.Throwouts;
  }

  collaps() {
    this.reduceTo(Page.None);
  }

  reduceToNone() {
    this.reduceTo(Page.None);
  }

  reduceToBib() {
    this.reduceTo(Page.Bib);
  }

  reduceToInput() {
    this.reduceTo(Page.Input);
  }

  reduceToRace() {
    this.reduceTo(Page.Race);
  }

  reduceToEvent() {
    this.reduceTo(Page.Event);
  }

  reduceToPreText() {
    this.reduceTo(Page.PreText);
  }

  reduceToTextArea() {
    this.reduceTo(Page.TextArea);
  }

  reduceToHelpText() {
    this.reduceTo(Page.HelpText);
  }

  reduceToParams() {
    this.reduceTo(Page.Params);
  }

  reduceToProps() {
    this.reduceTo(Page.Props);
  }

  reduceToJsonInfo() {
    this.reduceTo(Page.JsonInfo);
  }

  reduceToLegend() {
    this.reduceTo(Page.Legend);
  }

  toggleBib() {
    this.BibVisible = !this.BibVisible;
  }

  toggleRace() {
    this.RaceVisible = !this.RaceVisible;
  }

  toggleEvent() {
    this.EventVisible = !this.EventVisible;
  }

  togglePreText() {
    this.PreTextVisible = !this.PreTextVisible;
  }

  toggleTextArea() {
    this.TextAreaVisible = !this.TextAreaVisible;
  }

  toggleHelpText() {
    this.HelpTextVisible = !this.HelpTextVisible;
  }

  toggleParams() {
    this.ParamsVisible = !this.ParamsVisible;
  }

  toggleProps() {
    this.PropsVisible = !this.PropsVisible;
  }

  toggleJsonInfo() {
    this.JsonInfoVisible = !this.JsonInfoVisible;
  }

  toggleConfig() {
    this.ConfigVisible = !this.ConfigVisible;
  }

  toggleComponents() {
    this.ComponentsVisible = !this.ComponentsVisible;
  }

  toggleSonstiges() {
    this.SonstigesVisible = !this.SonstigesVisible;
  }

  toggleLegend() {
    this.LegendVisible = !this.LegendVisible;
    this.TextAreaLegendVisible = false;
    this.PreTextLegendVisible = false;
    if (this.eventTab && this.EventVisible) {
      this.eventTab.LegendVisible = false;
    }
  }

  toggleTextAreaLegend() {
    this.TextAreaLegendVisible = !this.TextAreaLegendVisible;
  }

  togglePreTextLegend() {
    this.PreTextLegendVisible = !this.PreTextLegendVisible;
  }

  toggleInput() {
    this.InputVisible = !this.InputVisible;
  }

  toggleTabsVisible() {
    this.TabsVisible = !this.TabsVisible;
  }

  reduceTo(p: Page = Page.Event) {
    this.CurrentPage = p;

    this.BibVisible = false;
    this.RaceVisible = false;
    this.EventVisible = false;
    this.ParamsVisible = false;
    this.PropsVisible = false;

    switch (p) {
      case Page.Bib:
        this.BibVisible = true;
        break;

      case Page.Race:
        this.RaceVisible = true;
        break;
      case Page.Event:
        this.EventVisible = true;
        break;

      case Page.Params:
        this.ParamsVisible = true;
        break;
      case Page.Props:
        this.PropsVisible = true;
        break;
      case Page.TextArea:
        this.TextAreaVisible = true;
        break;
      case Page.PreText:
        this.PreTextVisible = true;
        break;
      case Page.HelpText:
        this.HelpTextVisible = true;
        break;
      case Page.JsonInfo:
        this.JsonInfoVisible = true;
        break;
      case Page.Legend:
        this.LegendVisible = true;
        break;

      default:
        break;
    }
  }

  raceDeltaBtnClick(delta: number) {
    this.processQueue(false);
    const temp = this.CurrentRace + delta;
    const rc = this.BOManager.BO.BOParams.RaceCount;
    if (temp >= 1 && temp <= rc) {
      this.CurrentRace = temp;
    }
    if (temp === 0) {
      this.CurrentRace = rc;
    }
    if (temp > rc) {
      this.CurrentRace = 1;
    }
    this.updateFabs();
  }

  enableRaceBtnClick() {
    const r = this.CurrentRace;
    const cr = this.BOManager.BO.EventNode.Collection.Items[0];
    if (cr) {
      this.BOManager.BO.EventBO.EditRaceValue(cr, '$', 'colR_' + r);
      this.BOManager.BO.EventNode.Modified = true;
      this.calcEvent();
      this.updateBib();
    }
  }

  clearRaceBtnClick() {
    const r = this.CurrentRace;
    const bo = this.BOManager.BO;
    bo.EventNode.Collection.ResetRace(r);
    this.calcEvent();
    this.updateBib();
    this.updateFabs();
  }

  resetBtnClick() {
    this.reduceTo(Page.None);

    this.readEmpty();

    this.Auto = true;
    this.WantUpdateEvent = true;

    this.initCurrent();
    this.showFabs();

    this.cdref.detectChanges();

    this.reduceTo(Page.Event);
  }

  exampleBtnClick() {
    this.reduceTo(Page.Event);

    this.readExample();
  }

  assetBtnClick(ev: number) {
    this.reduceTo(Page.Event);

    switch (ev) {
      case 1:
        this.readNameTest();
        break;
      case 2:
        this.readFleetTest();
        break;

      case 3:
        this.read1991();
        break;
      case 4:
        this.read1997();
        break;

      case 5:
        this.readExample();
        break;
      default:
        this.readEmpty();
        break;
    }
  }

  clearBtnClick() {
    const BO = this.BOManager.BO;
    BO.ClearResult('');
    BO.StammdatenNode.Collection.ClearList();
    this.showEvent();
    this.updateBib();
    this.updateFabs();
  }

  onBibChanged(event: number) {
    this.CurrentBib = event;
    this.markBibAndShow();
  }

  onDataAvailable(event: IEventDataItem) {
    this.NewEventData = event;
    this.reduceTo(Page.Event);
  }

  onDataLoaded(event: IEventDataItem) {
    this.NewEventData = event;
    this.reduceTo(Page.Event);
  }

  onPropsChanged(event: EventProps) {
    this.BOManager.BO.EventProps.EventName = event.eventName;
    this.BOManager.BO.EventProps.ScoringSystem = event.scoringSystem;
    this.BOManager.BO.EventProps.SchemaCode = event.schemaCode;
    this.BOManager.BO.EventProps.IsTimed = event.isTimed;
    this.calcEvent();
    this.reduceTo(Page.Event);
  }

  onParamsChanged(event: EventParams) {
    if (event.createOption === 0) {
      this.createNew(event);
    } else {
      this.recreateEvent(event);
    }
    this.reduceTo(Page.Event);
  }

  updateBib() {
    if (this.bibTab) {
      this.bibTab.update();
    }
  }

  showEvent() {
    if (this.EventVisible) {
      this.eventTab.mark(this.CurrentBib);
      this.eventTab.show();
    }
  }

  calcEvent() {
    this.BOManager.BO.EventNode.Modified = true;
    this.BOManager.BO.Calc();
    this.showEvent();
  }

  updateAll() {
    this.calcEvent();
    this.updateBib();
  }

  memoAsset() {
    if (this.Asset.EventData !== '') {
      this.MemoText = this.Asset.EventData;
    } else {
      this.MemoText = this.info('Asset.EventData is empty');
    }
  }

  memoConvertedData() {
    if (this.BOManager.BO.ConvertedData) {
      this.MemoText = this.BOManager.BO.ConvertedData;
    } else {
      this.MemoText = this.info('BO.ConvertedData is empty');
    }
  }

  memoText(compact: boolean) {
    this.SL.Clear();
    this.BOManager.BO.BackupToSLCompact(this.SL, compact);
    this.MemoText = this.SL.Text;
  }

  memoRead() {
    const a = new TEventDataAsset();
    a.EventName = 'Textarea Asset';
    a.EventData = this.MemoText;
    this.NewEventData = a;
  }

  memoClear() {
    this.MemoText = '';
  }

  showConvertedData() {
    if (this.BOManager.BO.ConvertedData) {
      this.TestOutput = this.BOManager.BO.ConvertedData;
    } else {
      this.TestOutput = this.info('BO.ConvertData is empty');
    }
  }

  getTxtBackup(compact: boolean) {
    this.SL.Clear();
    this.BOManager.BO.BackupToSLCompact(this.SL, compact);
    this.TestOutput = this.SL.Text;
  }

  showSomething(n: number) {
    switch (n) {
      case 0:
        const ee: TExcelExporter = new TExcelExporter();
        this.TestOutput = ee.GetString(TableID.ResultList, this.BOManager.BO);
        break;

      case 1:
        const o = this.BOManager.BO.EventNode.FindBib(this.CurrentBib).Race[
          this.CurrentRace
        ].inspect();
        this.TestOutput = JSON.stringify(o, null, 2);
        break;
    }
  }

  clearTextOutput() {
    this.SL.Clear();
    this.TestOutput = '';
  }

  readEmpty() {
    const a = new TEventDataAsset();
    a.init_DefaultEmpty();
    this.NewEventData = a;
  }

  readExample() {
    const a = new TEventDataAsset();
    a.init_DefaultExample();
    this.NewEventData = a;
  }

  readNameTest() {
    const a = new TEventDataAsset();
    a.init_NameTest();
    this.NewEventData = a;
  }

  readFleetTest() {
    const a = new TEventDataAsset();
    a.init_FleetTest();
    this.NewEventData = a;
  }

  read1991() {
    const a = new TEventDataAsset();
    a.init_1991();
    this.NewEventData = a;
  }

  read1997() {
    const a = new TEventDataAsset();
    a.init_1997();
    this.NewEventData = a;
  }

  set NewEventData(value: IEventDataItem) {
    this.resetCurrent();

    // clear Queue, but do not 'update fabs'
    this.BOManager.BO.msgQueueE = [];

    // do actual loading
    this.BOManager.LoadNew(value.EventData);

    // save input
    this.Asset = value;

    const bo = this.BOManager.BO;

    this.Auto = true;
    this.WantUpdateEvent = true;
    this.updateThrowouts();
    this.BOManager.BO.updateStrictInputMode();

    // init Current (try to find it), without updating fabs
    let re = new CurrentNumbers();
    re = bo.findCurrentInEvent(re);
    this.assignCurrent(re);

    // show
    if (this.eventTab && this.EventVisible) {
      this.eventTab.initAndShow();
    }
    if (this.bibTab) {
      this.bibTab.update();
    }
    if (this.timingTab) {
      this.timingTab.clear();
      this.timingTab.Auto = true;
      this.timingTab.update();
    }
  }

  private info(msg: string): string {
    return '// ' + new Date().toLocaleTimeString() + ' - ' + msg;
  }

  bow(delta: number) {
    let b = this.CurrentBib + delta;
    if (b < 1) {
      // b = 1;
      b = this.BOManager.BO.EventNode.Collection.Count;
    }
    if (b > this.BOManager.BO.EventNode.Collection.Count) {
      // b = this.BOManager.BO.EventNode.Collection.Count;
      b = 1;
    }
    this.CurrentBib = b;
    this.markBibAndShow();
  }

  throwOut(delta: number) {
    const bo = this.BOManager.BO;
    const n = bo.EventProps.Throwouts + delta;
    this.NumberOfThrowoutsChanged(n);
  }

  private NumberOfThrowoutsChanged(value: number): boolean {
    const bo = this.BOManager.BO;
    if (!bo) {
      return false;
    } else if (value >= bo.BOParams.RaceCount) {
      return false;
    } else if (value < 0) {
      return false;
    } else if (bo.EventProps.Throwouts !== value) {
      bo.EventProps.Throwouts = value;
      this.updateThrowouts();
      this.calcEvent();
    }
    return true;
  }

  showFabs() {
    if (this.timingTab) {
      this.timingTab.show();
    }
  }

  updateFabs() {
    if (this.timingTab) {
      this.timingTab.update();
    }
  }

  toggleButtonPanel() {
    this.ButtonPanelVisible = !this.ButtonPanelVisible;
  }

  toggleCommandBar() {
    this.CommandBarVisible = !this.CommandBarVisible;
  }

  toggleExplorerBar() {
    this.ExplorerBarVisible = !this.ExplorerBarVisible;
  }

  toggleExplorerLine() {
    this.ExplorerLineVisible = !this.ExplorerLineVisible;
  }

  toggleBigButtonRow() {
    this.BOManager.BigButtonRow = !this.BOManager.BigButtonRow;
  }

  toggleDebug() {
    this.BOManager.IsDebug = !this.BOManager.IsDebug;
  }

  toggleThrowoutsRow() {
    this.ThrowoutsRowVisible = !this.ThrowoutsRowVisible;
  }

  toggleClearingRow() {
    this.ClearingRowVisible = !this.ClearingRowVisible;
  }

  toggleTableRow() {
    this.TableRowVisible = !this.TableRowVisible;
  }

  toggleRows() {
    this.RowsVisible = !this.RowsVisible;

    this.TableRowVisible = this.RowsVisible;
    this.ThrowoutsRowVisible = this.RowsVisible;
    this.ClearingRowVisible = this.RowsVisible;
  }

  ensureEvent() {
    if (!this.EventVisible) {
      this.EventVisible = true;
    }
  }

  ensureBib() {
    if (!this.BibVisible) {
      this.BibVisible = true;
    }
  }

  get timed(): boolean {
    return this.BOManager.BO.EventProps.IsTimed;
  }

  isTimed() {
    return this.timed;
  }

  memoCopy(memo: HTMLTextAreaElement) {
    if (memo instanceof HTMLTextAreaElement) {
      memo.select();
      document.execCommand('copy');
      memo.setSelectionRange(0, 0);
      this.openSnackBar('Copied text area content to clipboard.');
    }
  }

  copyCompact() {
    this.SL.Clear();
    this.BOManager.BO.BackupToSLCompact(this.SL, true);
    this.copyText(this.SL.Text);
    this.openSnackBar('Copied compact event backup text to clipboard.');
  }

  copyText(value: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  openSnackBar(msg: string) {
    this.snackBar.open(msg, null, { duration: 1500 });
  }

  createNew(event: EventParams) {
    const ed: IEventDataItem = {
      EventName: 'New Event',
      EventData: '',
    };

    const sl: string[] = [];

    sl.push('DP.RaceCount=' + event.raceCount);
    sl.push('DP.ITCount=' + event.itCount);
    sl.push('DP.StartlistCount=' + event.startlistCount);

    let s = '';
    for (const t of sl) {
      s += t;
      s += '\r\n';
    }
    ed.EventData = s;

    this.onDataAvailable(ed);
  }

  recreateEvent(event: EventParams) {
    const bo = this.BOManager.BO;

    this.SL.Clear();
    this.BOManager.BO.BackupToSLCompact(this.SL, false);

    this.SL.SL[2] = 'DP.RaceCount=' + event.raceCount;
    this.SL.SL[3] = 'DP.ITCount=' + event.itCount;
    this.SL.SL[4] = 'DP.StartlistCount=' + event.startlistCount;

    const a = new IEventDataItem();
    a.EventName = bo.EventProps.EventName;
    a.EventData = this.SL.Text;
    this.NewEventData = a;
  }

  resetCurrent() {
    this.CurrentRace = 1;
    this.CurrentTP = 0;
    this.CurrentBib = 1;
  }

  assignCurrent(value: CurrentNumbers) {
    this.CurrentRace = value.race;
    this.CurrentTP = value.tp;
    this.CurrentBib = value.bib;
    this.checkCurrent();
    this.updateFabs();
  }

  checkCurrent() {
    const p = this.BOManager.BO.BOParams;
    if (this.CurrentRace > p.RaceCount) {
      this.CurrentRace = p.RaceCount;
    }
    if (this.CurrentTP > p.ITCount) {
      this.CurrentTP = p.ITCount;
    }
  }

  initCurrent() {
    this.processQueue();

    const bo = this.BOManager.BO;

    let re = new CurrentNumbers();
    re = bo.findCurrentInEvent(re);
    this.assignCurrent(re);
  }

  initCurrentDefault() {
    const bo = this.BOManager.BO;

    const r = 1;

    let tp = 1;
    if (bo.EventProps.IsTimed === false || bo.BOParams.ITCount === 0) {
      tp = 0;
    }

    this.CurrentRace = r;
    this.CurrentTP = tp;
  }

  findCurrentB() {
    const bo = this.BOManager.BO;
    let cn = new CurrentNumbers();

    cn = bo.findCurrentInEvent(cn);

    this.assignCurrent(cn);
  }

  findCurrentE() {
    const bo = this.BOManager.BO;
    let result = new CurrentNumbers();
    result = bo.findCurrentInEvent(result);
    this.assignCurrent(result);
  }

  markBibAndShow() {
    if (this.eventTab) {
      this.eventTab.markAndShow(this.CurrentBib);
    }
  }

  sendMsg(msg: string) {
    if (this.connBar) {
      this.connBar.sendMsg(msg);
    }
  }

  processQueue(calc = true) {
    let msg: string;

    while (this.BOManager.BO.msgQueueE.length > 0) {
      msg = this.BOManager.BO.msgQueueE.pop();
      if (msg !== '') {
        this.BOManager.BO.Dispatch(msg);
        this.sendMsg(msg);
      }
    }

    this.updateAfterProcessingQueue(calc);
  }

  showQueue() {
    const l = this.BOManager.BO.msgQueueE;
    if (l.length === 0) {
      this.TestOutput = this.info('Queue is empty');
    } else {
      const SL = new TStringList();
      for (const s of l) {
        SL.Add(s);
      }
      this.TestOutput = SL.Text;
    }
  }

  loadFeaturedEvent() {}
  noop() {}

  handleWebSocketMsg(msg: string) {
    this.lastWebSocketMsg = msg;
    if (msg === 'Manage.Clear') {
      this.clearBtnClick();
    } else {
      this.BOManager.BO.Dispatch(msg);
      // this.calcRace();
      this.calcEvent();
      this.updateFabs();
    }
  }

  onNotify(nid: number) {
    switch (nid) {
      case 1:
        this.clearBtnClick();
    }
  }

  initParams() {}

  updateAfterProcessingQueue(calc = true) {
    if (calc && this.eventTab && this.EventVisible) {
      this.calcEvent();
      this.updateFabs();
    } else {
      this.BOManager.BO.EventNode.Modified = true;
      this.BOManager.BO.Calc();
    }
  }

  handleUpdate(value: number) {
    switch (value) {
      case 1:
        this.updateAfterProcessingQueue();
        break;
      case 2:
        this.showQueue();
        break;
      default:
        this.updateAll();
    }

    this.updateAll();
  }

  handleCalc(value: number) {
    // this.calcRace();
    this.calcEvent();
  }

  get CurrentRace() {
    return this.BOManager.BO.CurrentRace;
  }

  set CurrentRace(value: number) {
    this.BOManager.BO.CurrentRace = value;
  }

  get CurrentTP() {
    return this.BOManager.BO.CurrentTP;
  }

  set CurrentTP(value: number) {
    this.BOManager.BO.CurrentTP = value;
  }

  get CurrentBib() {
    return this.BOManager.BO.CurrentBib;
  }

  set CurrentBib(value: number) {
    this.BOManager.BO.CurrentBib = value;
  }

  get Auto() {
    return this.BOManager.BO.Auto;
  }

  set Auto(value: boolean) {
    this.BOManager.BO.Auto = value;
  }

  get StrictInputMode() {
    return this.BOManager.BO.StrictInputMode;
  }

  set StrictInputmode(value: boolean) {
    this.BOManager.BO.StrictInputMode = value;
  }

  get WantUpdateEvent() {
    return this.BOManager.BO.WantUpdateEvent;
  }

  set WantUpdateEvent(value: boolean) {
    this.BOManager.BO.WantUpdateEvent = value;
  }

  get UseQueue() {
    return this.BOManager.BO.UseQueue;
  }

  set UseQueue(value: boolean) {
    this.BOManager.BO.UseQueue = value;
  }

  toggleApi() {
    this.ApiVisible = !this.ApiVisible;
  }

  toggleConn() {
    this.ConnVisible = !this.ConnVisible;
  }
}
