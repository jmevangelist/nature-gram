export interface Observation {
    uuid: string;
    id: number;
    user: User;
    place_guess?: string;
    taxon?: Taxon;
    photos: Photos[];
    time_observed_at: string;
}

export interface User {
    id: number;
    name?: string;
    login?: string;
    icon?: string;
}

export interface Taxon {
    id: number;
    name?: string;
    iconic_taxon_name?: string;
    preferred_common_name?: string;
}

export interface Photos {
    id: number;
    url: string;
    original_dimensions: {height: number, width: number}; 
}

export interface Geojson {
    coordinates: number[];
    type: string;
}