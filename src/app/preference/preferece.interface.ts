import { Place, Taxon } from "../inaturalist/inaturalist.interface";


export interface Preference{
    active: boolean;
    place?: Place;
    taxon?: Taxon;
}