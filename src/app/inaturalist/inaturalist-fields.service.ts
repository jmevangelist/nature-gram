import { Injectable } from '@angular/core';
declare const rison: any; 

@Injectable({
    providedIn: 'root'
})
export class InaturalistFieldsService {
    User = {
        id: true,
        name: true,
        login: true,
        icon: true,
        observations_count: true
    }

    Photos = {
        id: true,
        url: true,
        original_dimensions: {height: true, width: true},
        attribution: true,
        license_code: true
    }

    Taxon = {
        id: true,
        name: true,
        iconic_taxon_name: true,
        preferred_common_name: true,
        rank: true,
        rank_level: true,
        default_photo: this.Photos,
        is_active: true,
        ancestor_ids: true
    }

    Taxon_search = {
        id: true,
        name: true,
        iconic_taxon_name: true,
        preferred_common_name: true,
        rank: true,
        rank_level: true,
        matched_term: true,
        default_photo: this.Photos,
        is_active: true,
        wikipedia_summary: true,
        ancestor_ids: true
    }

    Taxon_verbose = {
        id: true,
        name: true,
        iconic_taxon_name: true,
        preferred_common_name: true,
        rank: true,
        rank_level: true,
        matched_term: true,
        default_photo: this.Photos,
        taxon_photos: {taxon: true, photo: this.Photos},
        is_active: true,
        wikipedia_summary: true,
        wikipedia_url: true,
        ancestor_ids: true,
        ancestors: this.Taxon_search,
        children: this.Taxon_search
    }

    Identification = {
        id: true,
        uuid: true,
        created_at: true,
        current: true,
        taxon: this.Taxon,
        user: this.User,
        category: true,
        body: true
    }

    Faves = {
        id: true,
        user_id: true,
        user: {login: true}
    }

    Comment =  {
        id: true,
        uuid: true,
        body: true,
        created_at: true,
        user: this.User,
        html: true
    }

    Observation =  {
        uuid: true,
        id: true,
        user: {
            id: true,
            login: true,
            icon: true,
            icon_url: true
        },
        place_guess: true,
        taxon: { 
            id: true,
            name: true,
            preferred_common_name: true,
            rank: true,
            rank_level: true,
        },
        photos: this.Photos,
        time_observed_at: true,
        created_at: true,
        faves_count: true,
        identifications: this.Identification,
        description: true,
        faves: this.Faves,
        quality_grade: true,
        comments: this.Comment,
        quality_metrics: {
            id: true,
            agree: true,
            metric: true,
            user_id: true 
        },
        tags: true
    }

    Observation_verbose =  {
        uuid: true,
        id: true,
        user: {
            id: true,
            login: true,
            icon: true,
            icon_url: true,
            observations_count: true
        },
        place_guess: true,
        taxon: { 
            id: true,
            name: true,
            preferred_common_name: true,
            rank: true,
            rank_level: true,
        },
        photos: this.Photos,
        time_observed_at: true,
        created_at: true,
        faves_count: true,
        identifications: this.Identification,
        description: true,
        faves: this.Faves,
        quality_grade: true,
        comments: this.Comment,
        quality_metrics: {
            id: true,
            agree: true,
            metric: true,
            user_id: true 
        },
        tags: true,
        project_observations: {
            id: true,
            uuid: true,
            project: {
                id: true,
                description: true,
                icon: true,
                title: true
            }
        },
        geojson: { 
            coordinates: true,
            type: true
        },
        uri: true
    }

    UserAll = {
        id: true,
        name: true,
        login: true,
        icon: true,
        icon_url: true,
        observations_count: true,
        description: true
    }

    fields = {
        observation: rison.encode(this.Observation),
        observation_verbose: rison.encode(this.Observation_verbose)
    }

}
