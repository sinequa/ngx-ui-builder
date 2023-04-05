import { ChangeDetectionStrategy, Component, ElementRef, Inject, Input } from '@angular/core';

import { SvgIconRegistry } from './registry';
import { SVG_CONFIG, SVG_ICONS_CONFIG } from './types';

@Component({
  selector: 'svg-icon',
  standalone: true,
  template: '',
  host: {
    role: 'img',
    'aria-hidden': 'true',
  },
  styles: [
    `
      :host {
        display: inline-block;
        fill: currentColor;
        font-size: 1rem;

        transform: rotate(var(--rotate, 0deg));
        transition: transform 0.2s ease-in-out;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconComponent {
  @Input()
  set key(name: string) {
    const icon = this.registry.get(name) ?? this.registry.get(this.config.missingIconFallback?.name);

    if (icon) {
      this.element.setAttribute('aria-label', `${name}-icon`);
      this.element.classList.remove(`svg-icon-${this.lastKey}`);
      this.lastKey = name;
      this.element.classList.add(`svg-icon-${name}`);
      this.element.innerHTML = icon;
    }
  }

  @Input()
  set size(value: keyof SVG_CONFIG['sizes']) {
    this.element.style.fontSize = this.mergedConfig.sizes[value];
  }

  @Input() set width(value: number | string) {
    this.element.style.width = coerceCssPixelValue(value);
  }

  @Input() set height(value: number | string) {
    this.element.style.height = coerceCssPixelValue(value);
  }

  @Input()
  set fontSize(value: number | string) {
    this.element.style.fontSize = coerceCssPixelValue(value);
  }

  @Input()
  set color(color: string) {
    this.element.style.color = color;
  }

  private mergedConfig: SVG_CONFIG;
  private lastKey!: string;

  constructor(
    private host: ElementRef,
    private registry: SvgIconRegistry,
    @Inject(SVG_ICONS_CONFIG) private config: SVG_CONFIG
  ) {
    this.mergedConfig = this.createConfig();
    this.element.style.fontSize = this.mergedConfig.sizes[this.mergedConfig.defaultSize || 'md'];
  }

  get element() {
    return this.host.nativeElement;
  }

  private createConfig() {
    const defaults: SVG_CONFIG = {
      sizes: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        xxl: '2.5rem',
      },
    };

    return {
      ...defaults,
      ...this.config,
    };
  }
}

function coerceCssPixelValue(value: any): string {
  if (value == null) {
    return '';
  }

  return typeof value === 'string' ? value : `${value}px`;
}
