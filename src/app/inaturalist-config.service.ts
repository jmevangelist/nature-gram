import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class InaturalistConfigService {
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
        user: this.User
    }

    Observation =  {
        uuid: true,
        id: true,
        user: this.User,
        place_guess: true,
        taxon: this.Taxon,
        photos: this.Photos,
        time_observed_at: true,
        faves_count: true,
        identifications: this.Identification,
        description: true
    }
}