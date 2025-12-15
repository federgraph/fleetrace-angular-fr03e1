import { TStringList } from '../util/fb-strings';
import { TBaseMsg } from './bo-msg-base';
import { TMsgParser, TMsgType } from './bo-msg-parser';
import { TMsgToken } from './bo-msg-token';
import { TBO } from '../fr/fr-bo';
import { TUtils } from '../util/fb-classes';
import { TEventRowCollectionItem, TEventNode } from '../col/event/event-row-collection';
import { TEventBO } from '../col/event/event-bo';

export class TBOMsg extends TBaseMsg {
  MsgParser: TMsgParser;
  ItemPos = 0;
  AthleteID = 0;

  constructor(public BO: TBO) {
    super();
    this.MsgParser = new TMsgParser(BO);
  }

  FindCR(): TEventRowCollectionItem {
    const qn: TEventNode = this.BO.EventNode;
    if (qn != null) {
      if (this.ItemPos > 0) {
        return qn.Collection.Items[this.ItemPos - 1];
      } else {
        return qn.FindBib(this.Bib);
      }
    } else {
      return null;
    }
  }

  HandleProt() {
    this.MsgResult = 1;
    let MsgHandled = false;

    // Testmessage
    if (this.Cmd === 'XX') {
      // if (Verbose) Trace('HandleProt: Testmessage');
      this.MsgType = TMsgType.Test;
    } else if (this.Cmd === 'Count') {
      MsgHandled = this.BO.UpdateStartlistCount(this.RunID, TUtils.StrToIntDef(this.MsgValue, -1));
      this.MsgType = TMsgType.Param;
    } else if (this.AthleteID > 0) {
      MsgHandled = this.BO.UpdateAthlete(this.AthleteID, this.Cmd, this.MsgValue);
    } else if (this.Cmd === 'IsRacing') {
      if (this.BO.FindRaceIndex(this.RunID) > -1) {
        this.BO.SetRunIsRacing(this.RunID, this.MsgValue === TUtils.BoolStr(true));
      }
      this.MsgType = TMsgType.Option;
    } else {
      const temp: string = this.MsgValue.toLowerCase();
      if (temp === 'empty' || temp === 'null' || temp === '99:99:99.99') {
        this.MsgValue = '-1';
      }
      const cr: TEventRowCollectionItem = this.FindCR();
      if (cr != null) {
        MsgHandled = this.HandleMsg(cr);
      }
    }

    if (MsgHandled) {
      this.BO.CounterMsgHandled++;
      this.MsgResult = 0;
    }
  }

  HandleMsg(crev: TEventRowCollectionItem): boolean {
    let s: string = this.MsgValue;
    const o: TEventBO = crev.ru.ColBO;

    const r = this.GetRaceIndex();
    if (this.Cmd === 'QU') {
      this.BO.EditQU(r, crev.Index, s);
    } else if (this.Cmd === 'DG') {
      this.BO.EditDG(r, crev.Index, s);
    } else if (this.Cmd === 'Rank') {
      this.BO.EditOTime(r, crev.Index, s);
    } else if (this.Cmd === 'RV') {
      s = this.BO.EventNode.ColBO.EditRaceValue(crev, s, this.GetColName());
    } else if (this.Cmd === 'FM') {
      const ri: number = this.GetRaceIndex();
      if (ri !== -1) {
        crev.Race[ri].Fleet = TUtils.StrToIntDef(s, crev.Race[ri].Fleet);
      }
    } else if (this.Cmd === 'Bib') {
      s = o.EditBib(crev, s); // --> wird horizontal kopiert, bo.Bib[Index] := cr.Bib
    } else if (this.Cmd === 'SNR') {
      s = o.EditSNR(crev, s); // --> wird horizontal kopiert, bo.SNR[Index] := cr.SNR
    }
    return true;
  }

  private GetColName(): string {
    if (this.RunID.substring(0, 1) !== 'W') {
      return '';
    }
    const s: string = this.RunID.substring(1);
    const i: number = TUtils.StrToIntDef(s, -1);
    if (i < 1 || i > this.BO.BOParams.RaceCount) {
      return '';
    }
    return 'col_R' + i.toString();
  }

  private GetRaceIndex(): number {
    if (!this.RunID.startsWith('W')) {
      return -1;
    }
    const s = this.RunID.substring(1);
    let i = TUtils.StrToIntDef(s, -1);
    if (i < 1 || i > this.BO.BOParams.RaceCount) {
      i = -1;
    }
    return i;
  }

  override ClearResult() {
    super.ClearResult();
    this.ItemPos = -1;
    this.AthleteID = -1;
  }

  override DispatchProt(): boolean {
    this.ClearResult();

    // ignore Errors in compact format-------------
    if (this.Prot.startsWith('Error')) {
      this.MsgType = TMsgType.None;
      return true;
    }

    // Comments-----------------------------------
    if (this.Prot === '' || this.Prot.startsWith('//') || this.Prot.startsWith('#')) {
      this.MsgType = TMsgType.Comment;
      return true;
    }

    // Management Commands------------------------
    if (this.Prot.startsWith('Manage.')) {
      return true;
    }

    // Properties---------------------------------
    if (this.Prot.startsWith('EP.') || this.Prot.startsWith('Event.Prop_')) {
      this.BO.EventProps.ParseLine(this.Prot);
      this.MsgType = TMsgType.Prop;
      return true;
    }

    // ignore params------------------------------
    if (this.Prot.startsWith('DP.') || this.Prot.startsWith('Event.')) {
      return true;
    }

    // Data---------------------------------------
    if (this.Prot.startsWith(this.BO.MsgToken.cTokenModul)) {
      return this.ParseProt();
    }

    return false;
  }

  ParseProt(): boolean {
    this.MsgType = TMsgType.Input;
    const result: boolean = this.MsgParser.Parse(this.Prot);
    if (result) {
      this.MsgType = this.MsgParser.MsgType;
      this.MsgKey = this.MsgParser.MsgKey;
      this.MsgValue = this.MsgParser.sValue;

      this.Division = this.MsgParser.sDivision;
      this.RunID = this.MsgParser.sRunID;
      this.Bib = TUtils.StrToIntDef(this.MsgParser.sBib, -1);
      this.Cmd = this.MsgParser.sCommand;
      this.ItemPos = TUtils.StrToIntDef(this.MsgParser.sPos, -1);
      this.AthleteID = TUtils.StrToIntDef(this.MsgParser.sAthlete, -1);
      this.DBID = TUtils.StrToIntDef(this.MsgParser.sMsgID, -1);

      this.HandleProt();
    }
    return result;
  }
}
