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
    }

    Taxon = {
        id: true,
        name: true,
        iconic_taxon_name: true,
        preferred_common_name: true,
        rank: true
    }

    Taxon_search = {
        id: true,
        name: true,
        iconic_taxon_name: true,
        preferred_common_name: true,
        rank: true,
        matched_term: true
    }

    Photos = {
        id: true,
        url: true,
        original_dimensions: {height: true, width: true},
        attribution: true
    }

    Identification = {
        id: true,
        uuid: true,
        created_at: true,
        current: true,
        taxon: this.Taxon,
        user: this.User,
        category: true
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
        user: this.User,
        place_guess: true,
        taxon: this.Taxon,
        photos: this.Photos,
        time_observed_at: true,
        created_at: true,
        faves_count: true,
        identifications: this.Identification,
        description: true,
        faves: this.Faves,
        quality_grade: true,
        comments: this.Comment
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
    }

}
