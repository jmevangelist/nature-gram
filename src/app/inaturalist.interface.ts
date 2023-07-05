export interface Observation {
    uuid: string;
    id: number;
    user: User;
    place_guess?: string;
    taxon?: Taxon;
    photos: Photo[] | [];
    time_observed_at: string;
    faves_count: number;
    faves: Vote[];
    identifications: Identification[] | [];
    description: string | null;
    quality_grade: string;
    comments?: Comment[] | [];
}

export interface User {
    id: number;
    name?: string;
    login?: string;
    icon?: string;
    icon_url?: string;
    observations_count?: number;
    description?: string;
    roles?: string[];
    species_count?: number;
}

export interface Vote {
    id: number;
    user_id: number;
    vote_flag?: boolean;
    vote_scope?: string;
}

export interface Taxon {
    id: number;
    name?: string;
    iconic_taxon_name?: string;
    preferred_common_name?: string;
    rank?: string;
}

export interface Photo {
    id: number;
    url: string;
    original_dimensions: {height: number, width: number}; 
    attribution: string;
}

export interface Geojson {
    coordinates: number[];
    type: string;
}

export interface Identification {
    id: number;
    uuid: string;
    created_at: string;
    current: boolean;
    taxon: Taxon,
    user: User,
    category?: string;
}

export interface Comment {
    id: number;
    uuid: string;
    body?: string;
    created_at: string;
    user: User;
    html?: string;
}