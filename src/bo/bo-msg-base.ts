import { TStringList } from '../util/fb-strings';
import { TMsgType } from './bo-msg-parser';

export abstract class TReplayMsg {
  Division = '*'; // read FDivision write FDivision;
  RunID = ''; // read FRunID write FRunID;
  Bib = 0; // read FBib write FBib;
  Cmd = ''; // read FCmd write FCmd;
  MsgValue = ''; // read FMsgValue write FMsgValue;

  DBID = 0; // autoinc in DB
  LogTime = 0; // TDateTime;
  SeqNo = 0;
  Delivered = false;
  CheckInt = 0;
  ReplayInterval = 0;
  Hidden = false;
  ReplayOrder = 1000;
  IsError = false; // do not persist
  IsCheckSumError = false; // do not persist

  MsgType: TMsgType = TMsgType.None;
  MsgKey = '';

  constructor() {
    this.ClearResult();
  }

  static DiskMsgHeader(): string {
    return 'Cmd,MsgValue,ReplayInterval';
  }

  ClearResult() {
    // Content
    this.Division = '*';
    this.RunID = 'RunID';
    this.Bib = 0;
    this.Cmd = 'Cmd';
    this.MsgValue = '00:00:00.000';
    // Management
    this.DBID = -1;
    this.LogTime = 0; // Now;
    this.SeqNo = 1;
    this.IsError = false;
    this.IsCheckSumError = false;
    this.Delivered = false;
    this.CheckInt = 0;
    this.ReplayInterval = 1000;
    this.Hidden = false;
    this.ReplayOrder = 0;
  }

  GetDiskMsg(): string {
    const sep = ',';
    return this.Cmd + sep + this.MsgValue + sep + this.ReplayInterval + sep;
  }

  GetAsString(): string {
    let sDBID: string;
    if (this.DBID < 0) sDBID = 'DBID';
    else sDBID = '' + this.DBID;
    return this.Cmd + ',' + this.MsgValue + ',' + sDBID;
  }

  SetAsString(Value: string) {
    // let s: string;
    // let temp: string;
    // Todo: ..
    // s = TUtils.Cut(',', Value, temp);
    // Cmd = temp;
    // s = TUtils.Cut(',', s, temp);
    // this.MsgValue = temp;
    // s = TUtils.Cut(',', s, temp);
    // this.DBID = Number.parseInt(temp); // StrToIntDef(temp, -1);
  }

  Assign(Source: TReplayMsg) {
    const cr = Source;

    if (cr) {
      // Content
      this.Division = cr.Division;
      this.RunID = cr.RunID;
      this.Bib = cr.Bib;
      this.Cmd = cr.Cmd;
      this.MsgValue = cr.MsgValue;
      // Management
      this.DBID = cr.DBID;
      this.LogTime = cr.LogTime;
      this.SeqNo = cr.SeqNo;
      this.IsError = cr.IsError;
      this.IsCheckSumError = cr.IsCheckSumError;
      this.Delivered = cr.Delivered;
      this.CheckInt = cr.CheckInt;
      this.ReplayInterval = cr.ReplayInterval;
      this.Hidden = cr.Hidden;
      this.ReplayOrder = cr.ReplayOrder;
    }
  }

  get AsString(): string {
    return this.GetAsString();
  }
  set AsString(value: string) {
    this.SetAsString(value);
  }
  get DiskMsg(): string {
    return this.GetDiskMsg();
  }

  protected IsComment(s: string): boolean {
    if (s === '' || s.startsWith('//') || s.startsWith('#')) {
      return true;
    }
    return false;
  }
}

export class TMsgDB extends TStringList {
  Objects: TReplayMsg[] = [];

  protected GetMsgItem(Index: number): TReplayMsg {
    let result = null;
    if (Index >= 0 && Index <= this.Items.length - 1) result = this.Objects[Index];
    return result;
  }

  Dump(Memo: TStringList) {
    let cm: TReplayMsg;

    for (let i = 0; i < this.Items.length; i++) {
      cm = this.Objects[i];
      if (cm) Memo.Add(this.SL[i] + ' ' + cm.AsString);
    }
  }

  Save(FileName: string) {
    //     SL: TStringList;
    //     i: Integer;
    //     cr: TReplayMsg;
    //     s: string;
    //   begin
    //     SL = TStringList.Create;
    //       SL.Add(TReplayMsg.DiskMsgHeader);
    //       for i = 0 to Count-1 do
    //       begin
    //         cr = MsgItems[i];
    //         s = cr.DiskMsg;
    //         SL.Add(s);
    //       end;
    //       SL.SaveToFile(FileName);
  }

  MsgItems(Index: number): TReplayMsg {
    return this.GetMsgItem(Index);
  }
}

export class TBaseMsg extends TReplayMsg {
  Prot = '';
  MsgResult = 0;

  DispatchProt(): boolean {
    return false;
  }
}
