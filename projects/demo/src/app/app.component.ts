import { Component, VERSION } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ConfigurableService, ConfigService } from '@sinequa/ui-builder';
import { pokemons } from './pokemons';

declare interface Layout {
  name: string;
  id: string;
  items: string[];
  classes?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;

  // Pokestore state
  results$ = new BehaviorSubject(pokemons);
  abilities = pokemons
    .map((p) => p.abilities)
    .reduce((v1, v2) => v1.concat(v2), []);
  search?: string;
  selectedAbilities: string[] = [];
  selectedWeight?: number;
  selectedExperience?: number;

  layouts: Layout[] = [
    {name: "List view", id: "list-view", items: ['image', 'metas'], classes: 'flex-row mb-3 w-100'},
    {name: "Tile view", id: "tile-view", items: ['name', 'image'], classes: 'flex-column align-items-center p-3 w-25'}
  ]
  selectedLayout = "list-view";

  constructor(
    public configService: ConfigService,
    public configurableService: ConfigurableService
  ) {
    // Initial state of the UI builder
    this.configService.init([
      {
        id: 'header',
        type: 'container',
        items: ['title', 'searchform'],
        classes: 'flex-column'
      },
      {
        id: 'title',
        type: 'title',
        title: 'Pokestore'
      },
      {
        id: 'searchform',
        type: 'container',
        items: ['searchbar', 'breadcrumbs'],
        classes: 'flex-column'
      },
      {
        id: "searchbar",
        type: "searchbar"
      },
      {
        id: 'results',
        type: 'container',
        items: ['image', 'metas'],
        classes: 'flex-row mb-3 w-100'
      },
      {
        id: 'metas',
        type: 'container',
        items: ['description', 'ability', 'weight', 'experience'],
        classes: 'flex-column'
      },
      {
        id: 'name',
        type: 'metadata',
        field: 'name',
        hideField: true
      },
      {
        id: 'ability',
        type: 'metadata',
        field: 'abilities',
      },
      {
        id: 'weight',
        type: 'metadata',
        field: 'weight',
      },
      {
        id: 'experience',
        type: 'metadata',
        field: 'experience',
      },

      {
        id: 'filters',
        type: 'container',
        items: ['abilities', 'weightFilter', 'xpFilter'],
        classes: 'flex-column'
      },
      {
        id: 'weightFilter',
        type: 'range',
        field: 'selectedWeight',
      },
      {
        id: 'xpFilter',
        type: 'range',
        field: 'selectedExperience',
      }
    ]);
  }

  // Pokestore functionalities

  searchPokemons() {
    this.results$.next(
      pokemons.filter((p) => {
        if (
          this.selectedAbilities.length &&
          !p.abilities.find((a) => this.selectedAbilities.includes(a))
        )
          return false;
        if (this.selectedWeight && p.weight > this.selectedWeight) return false;
        if (this.selectedExperience && p.experience > this.selectedExperience)
          return false;
        if (this.search && !p.name.includes(this.search)) return false;
        return true;
      })
    );
  }

  selectAbility(a: string, event: Event) {
    this.selectedAbilities.push(a);
    this.searchPokemons();
    event.stopPropagation();
    event.preventDefault();
  }

  clear(event: Event) {
    this.search = undefined;
    this.selectedAbilities = [];
    this.selectedExperience = undefined;
    this.selectedWeight = undefined;
    this.searchPokemons();
    event.stopPropagation();
  }


  // Custom configurators

  selectLayout(layout: Layout) {
    const config = this.configService.getContainer('results');
    config.classes = layout.classes;
    config.items = layout.items;
    this.configService.updateConfig(config);
  }

  // Utilities

  asArray(value: any) {
    return Array.isArray(value)? value : [value];
  }

}
