import { TBaseBO } from "../bo/bo-base";
import { TBOManager } from "../bo/bo-manager";
import { TBOMsg } from "../bo/bo-msg";
import { TBaseMsg } from "../bo/bo-msg-base";
import { TMsgFactory } from "../bo/bo-msg-list";
import { TMsgToken } from "../bo/bo-msg-token";
import { TDivision, TInputAction, TInputActionManager, TMsgTree, TRun } from "../bo/bo-msg-tree";
import { TBOParams } from "../bo/bo-params";
import { TCalcEvent } from "../calc/calc-ev";
import { TPenaltyISAF, TISAFPenaltyDSQ } from "../calc/penalty-isaf";
import { TEventBO } from "../col/event/event-bo";
import { TEventRaceEntry } from "../col/event/event-race-entry";
import { TEventNode, TEventRowCollection, TEventRowCollectionItem } from "../col/event/event-row-collection";
import { TStammdatenBO } from "../col/stammdaten/stammdaten-bo";
import { FieldNames } from "../col/stammdaten/stammdaten-fieldnames";
import { TStammdatenNode } from "../col/stammdaten/stammdaten-node";
import { TStammdatenRowCollection } from "../col/stammdaten/stammdaten-row-collection";
import { TStammdatenRowCollectionItem } from "../col/stammdaten/stammdaten-row-collection-item";
import { TColCaptions } from "../grid/col-captions";
import { TUtils } from "../util/fb-classes";
import { TProp } from "../util/fb-props";
import { TStringList } from "../util/fb-strings";
import { TEventProps, TInputModeStrings, TInputMode } from "./fr-event-props";
import { TExcelExporter } from "./fr-excel-export";
import { TExcelImporter, TableID } from "./fr-excel-importer";
import { TIniImage } from "./fr-ini-image";
import { TNodeList } from "./fr-node-list";

export enum BOIndexer {
    SNR,
    Bib,
    QU,
    DG,
    OT,
    Penalty
}

export class CurrentNumbers {
    race: number = 0;
    tp: number = 0;
    bib: number = 0;
    withTime: number = 0;
    withPenalty: number = 0;
    withTimeOrPenalty: number = 0;

    constructor() {
        this.clear();
    }

    clear() {
        this.race = 0;
        this.tp = 0;
        this.bib = 0;
        this.withPenalty = 0;
        this.withTime = 0;
        this.withTimeOrPenalty = 0;
    }
}

export class TBO extends TBaseBO {
    static FSLBackup: TStringList = null;

    private FNodeList: TNodeList = null;

    msgQueueR: string[] = [];
    msgQueueE: string[] = [];
  
    CurrentRace: number = 1;
    CurrentTP: number = 0;
    CurrentBib: number = 1;

    UseQueue: boolean = false;
    Auto: boolean = true;
    WantUpdateEvent: boolean = true;
    StrictInputMode: boolean = true;

    UseInputFilter: boolean = false;
    UseOutputFilter: boolean = false;
    UseCompactFormat = true;

    ConvertedData: string = "";

    FModified: boolean = false;

    Gezeitet: number = 0;

    CounterCalc: number = 0;
    MsgCounter: number = 0;

    StammdatenBO: TStammdatenBO;
    StammdatenNode: TStammdatenNode;

    EventBO: TEventBO;
    EventNode: TEventNode;

    CalcEV: TCalcEvent;

    EventProps: TEventProps;
    ExcelImporter: TExcelImporter;
    MsgTree: TMsgTree;

    MsgFactory: TMsgFactory;

    PenaltyService: TPenaltyISAF;
    RaceData: Array<boolean>;

    constructor(
        public BOParams: TBOParams,
        public IniImage: TIniImage,
        public BOManager: TBOManager,
        public MsgToken: TMsgToken
    ) {
        super(
            IniImage,
            BOManager,
            BOParams);

        TColCaptions.InitDefaultColCaptions();

        this.MsgFactory = new TMsgFactory(this.BOManager.BO);

        this.MsgToken.cTokenA = "FR";

        this.MsgToken.DivisionName = this.BOParams.DivisionName;

        this.CalcEV = new TCalcEvent(this.IniImage, this, TCalcEvent.ScoringProvider_Inline);

        this.FNodeList = new TNodeList(this);

        this.MsgTree = new TMsgTree(this, this.MsgToken, null, this.MsgToken.cTokenA);

        this.PenaltyService = new TPenaltyISAF();

        // Stammdaten
        this.StammdatenBO = new TStammdatenBO(this);
        this.StammdatenNode = new TStammdatenNode(this.StammdatenBO, this);
        this.StammdatenNode.ColBO = this.StammdatenBO;
        this.StammdatenNode.NameID = "Stammdaten";
        this.StammdatenBO.CurrentNode = this.StammdatenNode;

        // RaceData
        this.RaceData = new Array<boolean>(BOParams.RaceCount + 1);
        for (let i = 0; i <= BOParams.RaceCount; i++)
            this.RaceData[i] = true;

        // Event
        this.EventBO = new TEventBO(this);
        this.EventNode = new TEventNode(
            this.EventBO,
            this,
        );
        this.EventNode.NameID = "E";
        this.EventNode.StammdatenRowCollection = this.StammdatenNode.Collection;
        this.EventBO.CurrentNode = this.EventNode;
        this.FNodeList.AddEventNode(this.EventNode);

        this.InitStartlistCount(this.BOParams.StartlistCount);
        this.EventProps = new TEventProps(this);
        this.ExcelImporter = new TExcelImporter();
    }

    ClearCommand(): void {
        this.ClearBtnClick();
    }

    GetSNR(Index: number): number {
        const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
        if (cr != null)
            return cr.SNR;
        else
            return -1;
    }

    GetBib(Index: number): number {
        const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
        if (cr != null)
            return cr.Bib;
        else
            return -1;
    }

    GetQU(RaceIndex: number, Index: number): number {
        const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
        if (cr != null)
            return cr.Race[RaceIndex].QU;
        else
            return 0;
    }

    GetDG(RaceIndex: number, Index: number): number {
        const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
        if (cr != null)
            return cr.Race[RaceIndex].DG;
        else
            return 0;
    }

    GetOT(RaceIndex: number, Index: number): number {
        const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
        if (cr != null)
            return cr.Race[RaceIndex].OTime;
        else
            return 0;
    }

    SetSNR(Index: number, Value: number): void {
        const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
        if (cr)
            cr.SNR = Value;
    }

    SetBib(Index: number, Value: number): void {
        const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
        if (cr)
            cr.Bib = Value;
    }

    SetQU(RaceIndex: number, Index: number, Value: number): void {
        const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
        if (cr) {
            cr.Race[RaceIndex].QU = Value;
            cr.Modified = true;
        }
    }

    SetDG(RaceIndex: number, Index: number, Value: number): void {
        const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
        if (cr != null) {
            cr.Race[RaceIndex].DG = Value;
            cr.Modified = true;
        }
    }

    SetOT(RaceIndex: number, Index: number, Value: number): void {
        const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
        if (cr) {
            cr.Race[RaceIndex].OTime = Value;
            cr.Modified = true;
        }
    }

    getFieldNumber(f: BOIndexer, RaceIndex: number, Index: number): number {
        switch (f) {
            case BOIndexer.SNR: return this.GetSNR(Index);
            case BOIndexer.Bib: return this.GetBib(Index);
            case BOIndexer.QU: return this.GetQU(RaceIndex, Index);
            case BOIndexer.DG: return this.GetDG(RaceIndex, Index);
            case BOIndexer.OT: return this.GetOT(RaceIndex, Index);
            default: return 0;
        }
    }
    SetFieldNumber(f: BOIndexer, RaceIndex: number, Index: number, value: number) {
        switch (f) {
            case BOIndexer.SNR: this.SetSNR(Index, value); break;
            case BOIndexer.Bib: this.SetBib(Index, value); break;
            case BOIndexer.QU: this.SetQU(RaceIndex, Index, value); break;
            case BOIndexer.DG: this.SetDG(RaceIndex, Index, value); break;
            case BOIndexer.OT: this.SetOT(RaceIndex, Index, value); break;
        }
    }

    GetPenalty(RaceIndex: number, Index: number): TPenaltyISAF {
        const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
        if (cr)
            return cr.Race[RaceIndex].Penalty;
        else
            return null;
    }

    SetPenalty(RaceIndex: number, Index: number, Value: TPenaltyISAF): void {
        const cr: TEventRowCollectionItem = this.EventNode.Collection.Items[Index];
        if (cr) {
            cr.Race[RaceIndex].Penalty.Assign(Value);
            cr.Modified = true;
        }
    }

    getRacePenalty(RaceIndex: number, Index: number): TPenaltyISAF {
        return this.GetPenalty(RaceIndex, Index);
    }
    setRacePenalty(RaceIndex: number, Index: number, value: TPenaltyISAF) {
        this.SetPenalty(RaceIndex, Index, value);
    }

    get Gemeldet(): number {
        return this.EventNode.Collection.Count;
    }

    get Gesegelt(): number {
        return this.BOParams.RaceCount;
    }

    private SaveLine(sender: object, s: string): void {
        if (TBO.FSLBackup)
            // if (s !="")
            TBO.FSLBackup.Add(s);
    }

    ClearList(rd: string): void {
        this.FNodeList.ClearList(rd);
    }

    ClearResult(rd: string): void {
        this.FNodeList.ClearResult(rd);
    }

    private SetModified(sender: object): void {
        this.FModified = true;
    }

    Calc(): boolean {
        this.CalcNodes();
        const result: boolean = this.FModified;
        if (this.FModified) {
            this.CalcEvent();
        }
        return result;
    }

    private CalcEvent(): void {
        this.CalcNodes();
        this.CounterCalc++;
        this.FModified = false;
    }

    private CalcNodes(): void {
        this.FNodeList.CalcNodes();
    }

    private InitStartlistCount(newCount: number): void {
        this.EventNode.Init(newCount);
        // ColorMatrix.BibCount = newCount;
    }

    UpdateStartlistCount(roName: string, newCount: number): boolean {
        let result = false;
        const cl: TEventRowCollection = this.EventNode.Collection;
        if ((cl.Count < newCount) && (newCount <= this.BOParams.MaxStartlistCount)) {
            while (cl.Count < newCount) {
                this.EventNode.Collection.Add();
            }
            result = true;
        }
        if ((cl.Count > newCount) && (newCount >= this.BOParams.MinStartlistCount)) {
            while (cl.Count > newCount) {
                const c: number = cl.Count;
                this.EventNode.Collection.Delete(c - 1);
            }
            result = true;
        }
        // this.BOParams.StartlistCount = cl.Count;
        return result;
    }

    UpdateAthlete(SNR: number, Cmd: string, value: string): boolean {
        let v = value;
        let cr: TStammdatenRowCollectionItem;

        cr = this.StammdatenNode.Collection.FindKey(SNR);
        if (cr == null) {
            cr = this.StammdatenNode.Collection.Add();
            cr.SNR = SNR;
        }

        const bo: TStammdatenBO = this.StammdatenBO;

        if (Cmd.includes("Prop_")) {
            const Key: string = Cmd.substring(5, Cmd.length);
            cr.Props[Key] = value;
        }
        else if (Cmd === FieldNames.FN || Cmd === "FN")
            v = bo.EditFN(cr, v);
        else if (Cmd === FieldNames.LN || Cmd === "LN")
            v = bo.EditLN(cr, v);
        else if (Cmd === FieldNames.SN || Cmd === "SN")
            v = bo.EditSN(cr, value);
        else if (Cmd === FieldNames.NC || Cmd === "NC")
            v = bo.EditNC(cr, value);
        else if (Cmd === FieldNames.GR || Cmd === "GR")
            v = bo.EditGR(cr, v);
        else if (Cmd === FieldNames.PB || Cmd === "PB")
            v = bo.EditPB(cr, v);
        else if (Cmd.startsWith("N")) {
            v = bo.EditNameColumn(cr, v, "col_" + Cmd);
        }
        // return v; // ###
        return true;
    }

    Save(): string {
        let result = "";
        TBO.FSLBackup = new TStringList();
        try {
            this.BackupToSL(null);
            result = TBO.FSLBackup.Text;
        }
        finally {
            TBO.FSLBackup = null;
        }
        return result;
    }

    Load(Data: string): void {
        this.FLoading = true;

        this.Clear();

        const m: TStringList = new TStringList();
        const msg: TBOMsg = new TBOMsg(this);

        try {
            this.ExcelImporter.RunImportFilter(Data, m);
            this.ConvertedData = m.Text;

            for (let i = 0; i < m.Count; i++) {
                const s: string = m.Items(i);
                msg.Prot = s;
                if (!msg.DispatchProt())
                    console.log("MessageError: " + s);
            }
            this.InitEventNode();
        }
        finally {
            this.FLoading = false;
        }
    }

    Dispatch(s: string): boolean {
        const msg: TBOMsg = new TBOMsg(this);
        msg.Prot = s;
        return msg.DispatchProt();
    }

    Clear(): void {
        this.ClearBtnClick();
    }

    /**
    implemented by calling BackupToSL() and then SaveToFile(FileName)		
    @param aFileName file name to save to
    */
    Backup(aFileName: string): void {
        TBO.FSLBackup = new TStringList();
        try {
            this.BackupToSL(null);
            TBO.FSLBackup.SaveToFile(aFileName);
        }
        finally {
            TBO.FSLBackup = null;
        }
    }

    /**
     * difference to Load: no clear() and data is read from file.		
     * @param aFileName file name for LoadFromfile
    */
    Restore(aFileName: string): void {
        // Unterschied zu Load: 1. kein Clear(), 2. Data from File

        // Clear();

        const m: TStringList = new TStringList();
        const msg: TBOMsg = new TBOMsg(this);

        this.FLoading = true;
        try {
            m.LoadFromFile(aFileName);
            for (let i = 0; i < m.Count; i++) {
                const s: string = m.SL[i];
                msg.Prot = s;
                if (!msg.DispatchProt())
                    console.log("MessageError: " + s);
            }
            this.InitEventNode();
        }
        finally {
            this.FLoading = false;
        }
    }

    BackupAthletes(): void {
        const savedSchemaCode: number = FieldNames.getSchemaCode();
        if (this.EventProps.NormalizedOutput)
            FieldNames.setSchemaCode(2);
        const cl: TStammdatenRowCollection = this.StammdatenNode.Collection;
        let cr: TStammdatenRowCollectionItem;
        let prop: TProp = new TProp();

        for (let i = 0; i < cl.Count; i++) {
            cr = cl.Items[i];
            if (cr.FN !== "")
                this.MsgTree.Division.Athlete(cr.SNR).FN(cr.FN);
            if (cr.LN !== "")
                this.MsgTree.Division.Athlete(cr.SNR).LN(cr.LN);
            if (cr.SN !== "")
                this.MsgTree.Division.Athlete(cr.SNR).SN(cr.SN);
            if (cr.NC !== "")
                this.MsgTree.Division.Athlete(cr.SNR).NC(cr.NC);
            if (cr.GR !== "")
                this.MsgTree.Division.Athlete(cr.SNR).GR(cr.GR);
            if (cr.PB !== "")
                this.MsgTree.Division.Athlete(cr.SNR).PB(cr.PB);
            if (cl.FieldCount > TStammdatenRowCollection.FixFieldCount) {
                for (let j = TStammdatenRowCollection.FixFieldCount + 1; j <= cl.FieldCount; j++) {
                    this.MsgTree.Division.Athlete(cr.SNR).FieldN(j, cr.getItem(j));
                }
            }
            else {
                for (let p = 0; p < cr.Props.Count; p++) {
                    prop = cr.Props.GetProp(7 + p, prop);
                    this.MsgTree.Division.Athlete(cr.SNR).Prop(prop.Key, prop.Value);
                }
            }
        }
        // if (TBO.FSLBackup != null)
        // TBO.FSLBackup.Add("");

        FieldNames.setSchemaCode(savedSchemaCode);
    }

    toString(): string {
        return this.ToTXT();
    }

    ToTXT(): string {
        const SL: TStringList = new TStringList();
        try {
            this.BackupToSL(SL);
            return SL.Text;
        }
        catch
        {
            return "";
        }
    }

    BackupToSL(SL: TStringList): void {
        this.BackupToSLCompact(SL, this.UseCompactFormat);
    }

    /**
     * Generates Backup in SL
     * @param SL StringList to contain the backup test
     * @param CompactFormat true if compact textg format should be used
     */
    BackupToSLCompact(SL: TStringList, CompactFormat: boolean): void {
        let InputAction: TInputAction;
        let g: TDivision;
        let r: TRun;

        let qn: TEventNode;
        let qc: TEventRowCollection;
        let qr: TEventRowCollectionItem;
        let ere: TEventRaceEntry;
        let f: number;

        if (SL)
            TBO.FSLBackup = SL;

        InputAction = new TInputAction();
        InputAction.OnSend = this.SaveLine;
        TInputActionManager.DynamicActionRef = InputAction;
        try {
            TBO.FSLBackup.Add("#Params");
            TBO.FSLBackup.Add("");
            TBO.FSLBackup.Add("DP.StartlistCount = " + this.BOParams.StartlistCount.toString());
            TBO.FSLBackup.Add("DP.ITCount = " + this.BOParams.ITCount.toString());
            TBO.FSLBackup.Add("DP.RaceCount = " + this.BOParams.RaceCount.toString());

            // EventProps
            TBO.FSLBackup.Add("");
            TBO.FSLBackup.Add("#Event Properties");
            TBO.FSLBackup.Add("");

            this.EventProps.SaveProps(TBO.FSLBackup);

            const o: TExcelExporter = new TExcelExporter();
            o.Delimiter = ';';

            // CaptionList
            if (TColCaptions.ColCaptionBag.IsPersistent && TColCaptions.ColCaptionBag.Count > 0) {
                TBO.FSLBackup.Add("");
                o.AddSection(TableID.CaptionList, this, TBO.FSLBackup);
            }

            if (CompactFormat) {
                try {
                    // NameList
                    TBO.FSLBackup.Add("");
                    o.AddSection(TableID.NameList, this, TBO.FSLBackup);

                    // StartList
                    TBO.FSLBackup.Add("");
                    o.AddSection(TableID.StartList, this, TBO.FSLBackup);

                    // FleetList
                    if (this.EventNode.UseFleets) {
                        TBO.FSLBackup.Add("");
                        o.AddSection(TableID.FleetList, this, TBO.FSLBackup);
                    }

                    // FinishList
                    TBO.FSLBackup.Add("");
                    o.AddSection(TableID.FinishList, this, TBO.FSLBackup);

                    // TimeList(s)
                    if (this.BOParams.ITCount > 0 || this.EventProps.IsTimed) {
                        TBO.FSLBackup.Add("");
                        o.AddSection(TableID.TimeList, this, TBO.FSLBackup);
                    }
                }
                catch
                {
                }
            }
            else {
                // Athletes
                TBO.FSLBackup.Add("");
                TBO.FSLBackup.Add("#Athletes");
                TBO.FSLBackup.Add("");

                this.BackupAthletes();

                // Startlist
                TBO.FSLBackup.Add("");
                TBO.FSLBackup.Add("#Startlist");
                TBO.FSLBackup.Add("");

                qn = this.EventNode;
                g = this.MsgTree.Division;
                qc = qn.Collection;
                for (let i1 = 0; i1 < qc.Count; i1++) {
                    qr = qc.Items[i1];
                    if ((qr.Bib > 0) && (qr.Bib !== qr.BaseID))
                        g.Race1.Startlist.Pos(qr.BaseID).Bib(qr.Bib.toString());
                    if (qr.SNR > 0)
                        g.Race1.Startlist.Pos(qr.BaseID).SNR(qr.SNR.toString());
                }
            }

            // Results
            for (let n = 1; n <= this.BOParams.RaceCount; n++) {
                TBO.FSLBackup.Add("");
                TBO.FSLBackup.Add("#" + this.MsgToken.cTokenRace + n.toString());
                TBO.FSLBackup.Add("");

                qn = this.EventNode;
                g = this.MsgTree.Division;
                qc = qn.Collection;
                if (n === 1)
                    r = g.Race1;
                else if ((n > 1) && (n <= this.BOParams.RaceCount))
                    r = g.Race(n);
                else
                    r = null;
                if (r == null)
                    continue;
                if (!this.GetIsRacing(n))
                    r.IsRacing(TUtils.BoolStr(false));
                for (let i = 0; i < qc.Count; i++) {
                    qr = qc.Items[i];
                    ere = qr.Race[n];

                    if (!CompactFormat) {
                        if (ere.OTime > 0)
                            r.Bib(qr.Bib).Rank(TUtils.IntToStr(ere.OTime));

                        if (this.EventNode.UseFleets) {
                            f = ere.Fleet;
                            if (f > 0)
                                r.Bib(qr.Bib).FM(f.toString());
                        }
                    }

                    if (this.EventNode.UseFleets) {
                        if (!ere.IsRacing)
                            r.Bib(qr.Bib).RV("x");
                    }

                    if (ere.QU !== 0)
                        r.Bib(qr.Bib).QU(ere.Penalty.toString());
                    if (ere.DG > 0)
                        r.Bib(qr.Bib).DG(ere.DG.toString());
                }
            }

            TBO.FSLBackup.Add("");
            TBO.FSLBackup.Add("EP.IM = " + TInputModeStrings.getName(this.EventProps.InputMode));

            // Errors
            this.EventNode.ErrorList.CheckAll(this.EventNode);
            if (this.EventNode.ErrorList.HasErrors()) {
                TBO.FSLBackup.Add("");
                TBO.FSLBackup.Add("#Errors");
                TBO.FSLBackup.Add("");
                this.EventNode.ErrorList.GetMsg(TBO.FSLBackup);
            }
        }
        finally {
            if (SL)
                TBO.FSLBackup = null;
            TInputActionManager.DynamicActionRef = null;
        }
    }

    BackupBtnClick(): void {
        const fn: string = this.BackupDir + "_Backup.txt";
        this.Backup(fn);
    }
    RestoreBtnClick(): void {
        this.Clear();
        const fn: string = this.BackupDir + "_Backup.txt";
        this.Restore(fn);
    }

    ClearBtnClick(): void {
        this.ClearResult("");
        this.ClearList("");
        this.UpdateEventNode();
    }

    OnIdle(): void {
        this.Calc();
    }

    InitEventNode(): void {
    }

    UpdateEventNode(): void {
    }

    NewMsg(): TBaseMsg {
        return this.MsgFactory.CreateMsg();
    }

    GetIsRacing(i: number): boolean {
        if (i < 1 || i > this.RaceData.length)
            return false;
        return this.RaceData[i];
    }

    SetIsRacing(i: number, value: boolean): void {
        if (i >= 1 && i <= this.RaceData.length)
            this.RaceData[i] = value;
    }

    FindRaceIndex(roName: string): number {
        if (roName.startsWith('W'))
            return -1;
        const s = roName.substring(1);
        const i = TUtils.StrToIntDef(s, -1);
        if (i < 1 || i > this.BOParams.RaceCount)
            return -1;
        return i;
    }

    GetRunIsRacing(RunID: string): boolean {
        const i = this.FindRaceIndex(RunID);
        if (i > -1)
            return this.GetIsRacing(i);
        else
            return false;
    }

    SetRunIsRacing(RunID: string, value: boolean) {
        const i = this.FindRaceIndex(RunID);
        if (i > -1)
            this.SetIsRacing(i, value);
    }

    EditQU(raceIndex: number, crIndex: number, value: string) {
        this.PenaltyService.Clear();
        // if (value.indexOf(',') > -1)
        // 	this.PenaltyService.FromString(value);
        // else
            this.PenaltyService.Parse(value);

        this.SetPenalty(raceIndex, crIndex, this.PenaltyService);

        // or this
        // this.SetQU(raceIndex, crIndex, this.PenaltyService.AsInteger)
    }

    EditDG(raceIndex: number, crIndex: number, value: string) {
        const t = TUtils.StrToIntDef(value, -1);
        if (t > -1)
            this.SetDG(raceIndex, crIndex, t);
    }

    EditOTime(raceIndex: number, crIndex: number, value: string) {
        const t = TUtils.StrToIntDef(value, -1);
        if (t > -1)
            this.SetOT(raceIndex, crIndex, t);
    }


    BackupPenalties(SL: TStringList, n: number): void {
        let InputAction: TInputAction;
        let g: TDivision;
        let r: TRun;

        let qn: TEventNode;
        let qc: TEventRowCollection;
        let qr: TEventRowCollectionItem;
        let ere: TEventRaceEntry;

        if (SL)
            TBO.FSLBackup = SL;

        InputAction = new TInputAction();
        InputAction.OnSend = this.SaveLine;
        TInputActionManager.DynamicActionRef = InputAction;
        try {
            qn = this.EventNode;
            g = this.MsgTree.Division;
            qc = qn.Collection;
            if (n === 1)
                r = g.Race1;
            else if ((n > 1) && (n <= this.BOParams.RaceCount))
                r = g.Race(n);
            else
                r = null;
            if (r) {
                if (!this.GetIsRacing(n))
                    r.IsRacing(TUtils.BoolStr(false));
                for (let i = 0; i < qc.Count; i++) {
                    qr = qc.Items[i];
                    ere = qr.Race[n];

                    if (this.EventNode.UseFleets) {
                        if (!ere.IsRacing)
                            r.Bib(qr.Bib).RV("x");
                    }

                    if (ere.QU !== 0)
                        r.Bib(qr.Bib).QU(ere.Penalty.toString());
                    if (ere.DG > 0)
                        r.Bib(qr.Bib).DG(ere.DG.toString());
                }
            }
        }
        finally {
            if (SL)
                TBO.FSLBackup = null;
            TInputActionManager.DynamicActionRef = null;
        }
    }

    findCurrentInEvent(result: CurrentNumbers): CurrentNumbers {
        const rc = this.EventNode.RaceCount;
        const tc = this.BOParams.ITCount;

        const en: TEventNode = this.EventNode;
        let cl: TEventRowCollectionItem[];
        let cr: TEventRowCollectionItem;
        let tp: TEventRaceEntry;
        for (let r = rc; r > 0; r--) {
            for (let t = tc; t >= 0; t--) {
                cl = en.Collection.Items;
                result.clear();
                for (let i = 0; i < cl.length; i++) {
                    cr = cl[i];
                    tp = cr.Race[r];
                    if (tp.IsRacing) {
                        if (tp.OTime > 0 || tp.Penalty.IsOut) {
                            result.race = r;
                            result.bib = cr.Bib;
                            if (tp.OTime > 0)
                                result.withTime++;
                            if (tp.Penalty.IsOut)
                                result.withPenalty++;
                            result.withTimeOrPenalty++;
                        }
                    }
                }
                if (result.withTimeOrPenalty) {
              if (result.withTimeOrPenalty === cl.length) {
                        if (r < rc) {
                            result.race++;
                        }
                    }
                    return result;
                }
            }
        }
        result.race = 1;
        return result;
    }

    tryToggleStrict() {
        if (this.StrictInputMode)
            this.EventProps.InputMode = TInputMode.Relaxed;
        else
            this.EventProps.InputMode = TInputMode.Strict;
    
        this.BOManager.BO.updateStrictInputMode();
      }

    updateStrictInputMode(): void {
        this.StrictInputMode = this.EventProps.InputMode === TInputMode.Strict;
    }

    toggleUseQueue() {
        this.UseQueue = !this.UseQueue;
    }

    markBib() {
        const bo = this.BOManager.BO;
        bo.EventBO.CurrentRow = bo.EventNode.FindBib(this.CurrentBib);
        const ru = bo.EventNode;
        if (ru)
          ru.ColBO.CurrentRow = ru.FindBib(this.CurrentBib);
      }
    
}
