import { TBO } from "./fr-bo";
import { TEventNode } from "../col/event/event-row-collection";

export class TNodeList {
    private EventNode: TEventNode;

    constructor(public BO: TBO) {
    }

    AddEventNode(en: TEventNode) {
        this.EventNode = en;
    }

    public ClearList(rd: string): void {
        if (rd === this.EventNode.NameID) {
            this.EventNode.Collection.ClearList();
            this.EventNode.Modified = true;
            return;
        }

        this.EventNode.Collection.ClearList();
    }

    ClearResult(rd: string): void {
        if (rd === this.EventNode.NameID) {
            this.EventNode.Collection.ClearResult();
            if (!this.Loading)
                this.EventNode.Calc();
            return;
        }

        this.EventNode.Collection.ClearResult();
        if (!this.Loading)
            this.EventNode.Calc();
    }

    CalcNodes(): void {
        if (this.EventNode.Modified)
            this.EventNode.Calc();
    }

    get Loading(): boolean {
        return this.BO.Loading;
    }

}
