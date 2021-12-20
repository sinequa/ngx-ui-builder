import { Component, VERSION } from '@angular/core';
import { ConfigurableService, ConfigService } from '@sinequa/ui-builder';
import { CommonModule } from '@angular/common';
import { pokemons } from './pokemons';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;

  results$ = new BehaviorSubject(pokemons);
  abilities = pokemons
    .map((p) => p.abilities)
    .reduce((v1, v2) => v1.concat(v2), []);
  search?: string;
  selectedAbilities: string[] = [];
  selectedWeight?: number;
  selectedExperience?: number;

  codeFactory = {
    title: (config) =>
      `<h1>Pokestore</h1>`,
    metadata: (config) =>
      `<strong>${config.field}: </strong><span>{{ data['${config.field}'] }}</span>`,
    description: (config) =>
      `<p [innerHTML]="data.description"></p>`,
    image: (config) =>
      `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{{ data.id }}.png" [title]="data.name" />`,
  };

  codeModules = [CommonModule];

  constructor(
    public configService: ConfigService,
    public configurableService: ConfigurableService
  ) {
    this.configService.init([
      {
        id: 'header',
        type: 'container',
        items: ['title', 'searchform'],
      },
      {
        id: 'title',
        type: 'title',
        title: 'Pokestore',
      },
      {
        id: 'searchform',
        type: 'container',
        items: ['searchbar', 'breadcrumbs'],
        classes: 'd-flex flex-row',
      },

      {
        id: 'results',
        type: 'container',
        items: ['image', 'metas'],
        classes: 'd-flex flex-row',
      },
      {
        id: 'metas',
        type: 'container',
        items: ['description', 'ability', 'weight', 'experience'],
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
      },
    ]);
  }

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

  selectAbility(a: string) {
    this.selectedAbilities.push(a);
    this.searchPokemons();
    return false;
  }

  clear() {
    this.search = undefined;
    this.selectedAbilities = [];
    this.selectedExperience = undefined;
    this.selectedWeight = undefined;
    this.searchPokemons();
  }

}
