# UI Builder

- [Demo application](demo)
- [API Reference](compodoc)

**UI Builder** is an Angular library that lets developers create applications that can be easily reshaped and reconfigured by end-users through point-and-click and drag-and-drop interactions.

![Demo UI Builder](demo.gif)

## Getting Started

Add the library to your application with:

```
ng add @sinequa/ngx-ui-builder
```

(This command installs the library and its peer dependencies from npm)

Import the 2 following modules in your `app.module.ts` (the first one to display configurable components in your app; the second one to display their configurator):

```ts
import { DynamicViewsModule, ConfiguratorModule } from '@sinequa/ngx-ui-builder';

@NgModule({
    imports: [
        ...
        DynamicViewsModule,
        ConfiguratorModule
    ]
})
```

Import the Bootstrap utilities and UI Builder stylesheets in your project's stylesheet:

```scss
@import "~bootstrap/dist/css/bootstrap-utilities.min"; // Unless you already use Bootstrap or Bootstrap utilities
@import "~@sinequa/ngx-ui-builder/styles/ui-builder";
```

(Note that the Bootstrap utilities should not affect the styling of your app: they only introduce convenience styling such as `display: flex` for the class name `d-flex`)

Initialize the configuration service with a blank configuration:

```ts
import { ConfigService } from '@sinequa/ngx-ui-builder';

...
export class AppComponent {
    
  constructor(
    public configService: ConfigService
  ){
    this.configService.init([]);
  }
```

Create a first zone in your application:

```html
<uib-zone id="test">
    <ng-template uib-template="test">
        <h1>Hello world</h1>
    </ng-template>
</uib-zone>
```

Display the configurator and toolbar (wrapped under a `.uib-bootstrap` element, so that these components are correctly styled):

```html

<div class="uib-bootstrap">

    <uib-toolbar>
        
    <!-- Inject custom toolbar buttons here -->

    </uib-toolbar>

    <uib-configurator>
        
    <!-- Inject custom configurators here -->
      
    </uib-configurator>

</div>
```
