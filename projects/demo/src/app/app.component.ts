import { Component, OnInit } from '@angular/core';
import { ConfigurableService, ConfigService, ZoneComponent, ToolbarComponent, ConfiguratorComponent, ToastComponent, TemplateNameDirective, NgModelChangeDebouncedDirective, TooltipDirective } from '@sinequa/ngx-ui-builder';
import { PokemonService } from "./pokemon.service";
import { defaultConfig } from "./config";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    ZoneComponent,
    ToolbarComponent,
    ConfiguratorComponent,
    ToastComponent,
    TemplateNameDirective,
    NgModelChangeDebouncedDirective,
    TooltipDirective
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  // Pokestore state
  allAbilities: string[] = [];
  searchText?: string;
  abilities: string[] = [];
  weight?: number;
  experience?: number;

  constructor(
    public configService: ConfigService,
    public configurableService: ConfigurableService,
    public pokemonService: PokemonService
  ) {}

  ngOnInit() {

    this.allAbilities = this.pokemonService.getAbilities();

    // Initial state of the UI builder
    this.configService.init(defaultConfig);
  }

  // Pokestore functionalities

  search() {
    this.pokemonService.searchPokemons(this.searchText, this.abilities, this.weight, this.experience);
  }

  selectAbility(a: string) {
    this.abilities.push(a);
    this.search();
    return false;
  }

  clear() {
    this.searchText = undefined;
    this.abilities = [];
    this.experience = undefined;
    this.weight = undefined;
    this.pokemonService.Reset();
  }

  // Utilities

  asArray(value: any) {
    return Array.isArray(value)? value : [value];
  }

}
