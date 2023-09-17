import { KeyValue } from "../shared/generic.interface";

export interface Chip{
    label: string;
    options?: string[];
    selected?: boolean;
    option?: string;
    value?:string | KeyValue;
    type?:string;
}