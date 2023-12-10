import { Injectable, inject } from '@angular/core';
import { Observation } from '../inaturalist/inaturalist.interface';
import { InaturalistService } from '../inaturalist/inaturalist.service';
import { BehaviorSubject, Observable, skip } from 'rxjs';
import { PreferenceService } from '../preference/preference.service';
import { Chip } from '../chips/chip.interface';
import { KeyValue } from '../shared/generic.interface';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private inatService: InaturalistService = inject(InaturalistService);
  private prefservice: PreferenceService = inject(PreferenceService);
  params: KeyValue;

  chipGroup!: any[];

  filterChips: Chip[] = [
    {
      label: 'New',
      options: ['Today', 'Past week', 'Past month', 'Past year', 'All time'],
    },
    { label: 'Recently Updated' },
    {
      label: 'Popular',
      options: ['Today', 'Past week', 'Past month', 'Past year', 'All time'],
    },
    {
      label: 'Random',
      options: ['Today', 'Past week', 'Past month', 'Past year', 'All time'],
    },
  ];

  constructor() {
    let s = localStorage.getItem('selectedFilter');
    if (s) {
      let selectedFilter = JSON.parse(s);
      let i = this.filterChips.findIndex(
        (fC) => fC.label == selectedFilter.label
      );
      if (i >= 0) {
        this.filterChips[i].selected = true;
        if (selectedFilter.option) {
          this.filterChips[i].option = selectedFilter.option;
        }
      }
    } else {
      this.filterChips[0].option = 'Today';
      this.filterChips[0].selected = true;
    }

    this.params = {
      order_by: 'created_at',
      created_d2: new Date(),
      per_page: 10,
    };

    this.chipGroup = [];
    this.genChips();
    this.chipGroup.forEach((cG: any) => {
      if (cG) {
        this.updateParams(cG);
      }
    });

    this.prefservice.signal.pipe(skip(1)).subscribe(() => {
      this.refresh();
    });
  }

  genChips() {
    this.chipGroup.length = 0;
    this.chipGroup.push({ chips: this.filterChips, key: 'default' });

    this.chipGroup.push({
      chips: [{ label: 'Unidentified', value: 'false' }],
      key: 'identified',
      multiSelect: true,
      contraKey: 'taxon_id',
    });

    let taxonChips: Chip[] = [];

    this.prefservice.taxa.forEach((p) => {
      taxonChips.push({
        label: p.taxon?.name ?? '',
        value: p.taxon?.id.toString(),
        selected: p.active,
      });
    });
    if (taxonChips.length) {
      this.chipGroup.push({
        chips: taxonChips,
        multiSelect: true,
        key: 'taxon_id',
      });
    }

    let placesChips: Chip[] = [];
    this.prefservice.places.forEach((p) => {
      placesChips.push({
        label: p.place?.display_name ?? '',
        value: p.place?.id.toString(),
        selected: p.active,
      });
    });

    if (placesChips.length) {
      this.chipGroup.push({
        chips: placesChips,
        multiSelect: true,
        key: 'place_id',
      });
    }

    let options: Chip[] = [];
    this.prefservice.baseOptions.forEach((o) => {
      if (this.prefservice.options.includes(o.name)) {
        options.push({
          label: o.label,
          option: o.name,
          value: o.value.toString(),
          selected: true,
        });
      }
    });

    if (options.length) {
      this.chipGroup.push({
        chips: options,
        multiSelect: true,
        key: 'options',
      });
    }
  }

  updateParams(chipG: any) {
    if (chipG.key == 'default') {
      let selected = chipG.chips.filter((c: Chip) => c.selected).pop();
      switch (selected.label) {
        case 'New':
          this.params['order_by'] = 'created_at';
          delete this.params['popular'];
          break;
        case 'Popular':
          this.params['order_by'] = 'votes';
          this.params['popular'] = true;
          break;
        case 'Recently Updated':
          this.params['order_by'] = 'updated_at';
          delete this.params['popular'];
          break;
        case 'Random':
          this.params['order_by'] = 'random';
          delete this.params['popular'];
          break;
      }

      if (selected.option) {
        let d2 = Date.now();
        this.params['created_d2'] = new Date();
        switch (selected.option) {
          case 'Today':
            this.params['created_d1'] = new Date(d2 - 24 * 60 * 60 * 1000);
            break;
          case 'Past week':
            this.params['created_d1'] = new Date(d2 - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'Past month':
            this.params['created_d1'] = new Date(d2 - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'Past year':
            this.params['created_d1'] = new Date(
              d2 - 365 * 24 * 60 * 60 * 1000
            );
            break;
          case 'All time':
            delete this.params['created_d1'];
            break;
          default:
            break;
        }
      } else {
        delete this.params['created_d1'];
      }
    } else if (chipG.key == 'options') {
      chipG.chips.forEach((c: Chip) => {
        if (c.selected) {
          this.params[c.option ?? ''] = c.value;
        } else {
          delete this.params[c.option ?? ''];
        }
      });
    } else if (chipG.multiSelect) {
      let selected = chipG.chips
        .filter((c: Chip) => c.selected && !c.type)
        .map((s: Chip) => s.value);
      if (selected.length) {
        this.params[chipG.key] = selected;
        if (chipG.contraKey) {
          delete this.params[chipG.contraKey];
          let cgi = this.chipGroup.findIndex((cg) => cg.key == chipG.contraKey);
          if (cgi >= 0) {
            this.chipGroup[cgi].chips.forEach((c: Chip) => {
              c.selected = false;
            });
          }
        }
      } else {
        delete this.params[chipG.key];
        if (chipG.contraKey) {
          let contraGroup = this.chipGroup.find(
            (cg) => cg.key == chipG.contraKey
          );
          if (contraGroup) {
            this.updateParams(contraGroup);
          }
        }
      }
    }
  }

  getCurrentParams(): KeyValue {
    return this.params;
  }

  refresh() {
    this.genChips();
    this.params = {
      order_by: 'created_at',
      created_d2: new Date(),
    };
    this.chipGroup.forEach((cG: any) => {
      this.updateParams(cG);
    });
  }

  saveDefaultFilter() {
    let s = this.filterChips
      .filter((fC) => fC.selected)
      .map((fC) => {
        return { label: fC.label, option: fC.option };
      })
      .pop();
    if (s) {
      localStorage.setItem('selectedFilter', JSON.stringify(s));
    }
  }
}
