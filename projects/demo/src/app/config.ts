export const defaultConfig = [
  {
    id: 'header',
    type: '_container',
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
    type: '_container',
    items: ['searchbar','applied-filters','clear-filters'],
    classes: 'flex-row'
  },
  {
    id: "searchbar",
    type: "searchbar"
  },
  {
    id: 'results',
    type: '_container',
    items: ['image', 'metas'],
    classes: 'result-item flex-row mb-3 w-100'
  },
  {
    id: 'metas',
    type: '_container',
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
    type: '_container',
    items: ['abilities', 'weightFilter', 'xpFilter'],
    classes: 'flex-column'
  },
  {
    id: 'weightFilter',
    type: 'range',
    field: 'weight',
  },
  {
    id: 'xpFilter',
    type: 'range',
    field: 'experience',
  }
];