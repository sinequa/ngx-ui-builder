# ngx-ui-builder documentation

Welcome to the documentation site of the UI Builder library.

- [Demo application](demo)
- [API Reference](compodoc)

## Getting Started

Install the library to your application with:

```
ng add @sinequa/ngx-ui-builder
```

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
@import "~bootstrap/dist/css/bootstrap-utilities.min"; // Unless you already use Bootstrap
@import "~@sinequa/ngx-ui-builder/styles/ui-builder";
```

(Note that the Bootstrap utilities should not affect the styling of your app: they only introduce convenience styling such as `display: flex` for the class name `d-flex`)

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