import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface Pokemon {
  name: string;
  description: string;
  id: number;
  abilities: string[];
  weight: number;
  experience: number;
}

@Injectable({providedIn: 'root'})
export class PokemonService {

  pokemons: Pokemon[] = [
    {
      name: 'slowpoke',
      description:
        "Slowpoke (Japanese: ヤドン Yadon) is a dual-type Water/Psychic Pokémon introduced in Generation I. It evolves into Slowbro starting at level 37 or Slowking when traded while holding a King's Rock. In Galar, Slowpoke has a pure Psychic-type regional form, introduced in Pokémon Sword and Shield's 1.1.0 patch. It evolves into Galarian Slowbro when exposed to a Galarica Cuff or Galarian Slowking when exposed to a Galarica Wreath.",
      id: 79,
      abilities: ['oblivious', 'own-tempo', 'regenerator'],
      weight: 360,
      experience: 63,
    },
    {
      name: 'zacian-hero',
      description:
        'Zacian (Japanese: ザシアン Zacian) is a Fairy-type Legendary Pokémon introduced in Generation VIII. While it is not known to evolve into or from any other Pokémon, Zacian has a second form activated by giving it a Rusted Sword to hold. Its original form, Hero of Many Battles, will then become the Fairy/Steel-type Crowned Sword. Zacian is the game mascot of Pokémon Sword, appearing on the boxart in its Crowned Sword form. It is a member of the Hero duo with Zamazenta.',
      id: 888,
      abilities: ['intrepid-sword'],
      weight: 1100,
      experience: 335,
    },
    {
      name: 'clefairy',
      description:
        'Clefairy (Japanese: ピッピ Pippi) is a Fairy-type Pokémon introduced in Generation I. Prior to Generation VI, it was a Normal-type Pokémon. It evolves from Cleffa when leveled up with high friendship and evolves into Clefable when exposed to a Moon Stone.',
      id: 35,
      abilities: ['cute-charm'],
      weight: 75,
      experience: 113,
    },
    {
      name: 'pikachu',
      description:
        'Pikachu (Japanese: ピカチュウ Pikachu) is an Electric-type Pokémon introduced in Generation I. It evolves from Pichu when leveled up with high friendship and evolves into Raichu when exposed to a Thunder Stone. In Alola, Pikachu will evolve into Alolan Raichu when exposed to a Thunder Stone.',
      id: 25,
      abilities: ['static', 'lightning-rod'],
      weight: 60,
      experience: 112,
    },
    {
      name: 'bulbasaur',
      description:
        'Bulbasaur (Japanese: フシギダネ Fushigidane) is a dual-type Grass/Poison Pokémon introduced in Generation I. It evolves into Ivysaur starting at level 16, which evolves into Venusaur starting at level 32. Along with Charmander and Squirtle, Bulbasaur is one of three starter Pokémon of Kanto available at the beginning of Pokémon Red, Green, Blue, FireRed, and LeafGreen.',
      id: 1,
      abilities: ['overgrow', 'chlorophyll'],
      weight: 69,
      experience: 64,
    },
    {
      name: 'charmander',
      description:
        'Charmander (Japanese: ヒトカゲ Hitokage) is a Fire-type Pokémon introduced in Generation I. It evolves into Charmeleon starting at level 16, which evolves into Charizard starting at level 36. Along with Bulbasaur and Squirtle, Charmander is one of three starter Pokémon of Kanto available at the beginning of Pokémon Red, Green, Blue, FireRed, and LeafGreen.',
      id: 4,
      abilities: ['blaze', 'solar-power'],
      weight: 85,
      experience: 62,
    },
    {
      name: 'sandshrew',
      description:
        'Sandshrew (Japanese: サンド Sand) is a Ground-type Pokémon introduced in Generation I. It evolves into Sandslash starting at level 22. In Alola, Sandshrew has a dual-type Ice/Steel regional form. It evolves into Alolan Sandslash when exposed to an Ice Stone.',
      id: 27,
      abilities: ['sand-veil', 'sand-rush'],
      weight: 120,
      experience: 60,
    },
    {
      name: 'wartortle',
      description:
        'Wartortle (Japanese: カメール Kameil) is a Water-type Pokémon introduced in Generation I. It evolves from Squirtle starting at level 16 and evolves into Blastoise starting at level 36.',
      id: 142,
      abilities: ['torrent', 'rain-dish'],
      weight: 225,
      experience: 142,
    },
    {
      name: 'poliwhirl',
      description:
        "Poliwhirl (Japanese: ニョロゾ Nyorozo) is a Water-type Pokémon introduced in Generation I. It evolves from Poliwag starting at level 25. It evolves into Poliwrath when exposed to a Water Stone or Politoed when traded while holding a King's Rock.",
      id: 61,
      abilities: ['water-absorb', 'damp', 'swift-swim'],
      weight: 200,
      experience: 135,
    },
    {
      name: 'vileplume',
      description:
        "Vileplume (Japanese: ラフレシア Ruffresia) is a dual-type Grass/Poison Pokémon introduced in Generation I. It evolves from Gloom when exposed to a Leaf Stone. It is one of Oddish's final forms, the other being Bellossom.",
      id: 45,
      abilities: ['chlorophyll', 'effect-spore'],
      weight: 186,
      experience: 221,
    },
  ];
  
  pokemons$ = new BehaviorSubject<Pokemon[]>(this.pokemons);

  searchPokemons(search = "", abilities: string[] = [], weight?: number, experience?: number) {
    return this.pokemons$.next(this.pokemons.filter(p => {
      if (abilities.length && !p.abilities.find(a => abilities.includes(a)))
        return false;
      if (weight && p.weight > weight) return false;
      if (experience && p.experience > experience)
        return false;
      if (search && !p.name.includes(search)) return false;
      return true;
    }));
  }

  getAbilities(): string[] {
    return this.pokemons
      .map((p) => p.abilities)
      .reduce((v1, v2) => v1.concat(v2), []);
  }

}
