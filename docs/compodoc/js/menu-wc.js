'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ngx-ui-builder documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/ConfigurableModule.html" data-type="entity-link" >ConfigurableModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-ConfigurableModule-7fc1be49f7ff5e465d252c5b43d32f013c568a163a48b6cafe0ca47bf830e6168628a27916e221ffcf314a48da5e821cc658d3d0405badc87fdae4515ebc82a5"' : 'data-target="#xs-directives-links-module-ConfigurableModule-7fc1be49f7ff5e465d252c5b43d32f013c568a163a48b6cafe0ca47bf830e6168628a27916e221ffcf314a48da5e821cc658d3d0405badc87fdae4515ebc82a5"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-ConfigurableModule-7fc1be49f7ff5e465d252c5b43d32f013c568a163a48b6cafe0ca47bf830e6168628a27916e221ffcf314a48da5e821cc658d3d0405badc87fdae4515ebc82a5"' :
                                        'id="xs-directives-links-module-ConfigurableModule-7fc1be49f7ff5e465d252c5b43d32f013c568a163a48b6cafe0ca47bf830e6168628a27916e221ffcf314a48da5e821cc658d3d0405badc87fdae4515ebc82a5"' }>
                                        <li class="link">
                                            <a href="directives/ConfigurableDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfigurableDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfiguratorModule.html" data-type="entity-link" >ConfiguratorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ConfiguratorModule-cacec9692b1ca57dc0254bf5ef9d0731a12ac2404808266d8a466708d7c6040cd2d8615eaa3a3442c2229b70f1a7895ec9004bc6940ffd48fd8e7c7b1033e48f"' : 'data-target="#xs-components-links-module-ConfiguratorModule-cacec9692b1ca57dc0254bf5ef9d0731a12ac2404808266d8a466708d7c6040cd2d8615eaa3a3442c2229b70f1a7895ec9004bc6940ffd48fd8e7c7b1033e48f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ConfiguratorModule-cacec9692b1ca57dc0254bf5ef9d0731a12ac2404808266d8a466708d7c6040cd2d8615eaa3a3442c2229b70f1a7895ec9004bc6940ffd48fd8e7c7b1033e48f"' :
                                            'id="xs-components-links-module-ConfiguratorModule-cacec9692b1ca57dc0254bf5ef9d0731a12ac2404808266d8a466708d7c6040cd2d8615eaa3a3442c2229b70f1a7895ec9004bc6940ffd48fd8e7c7b1033e48f"' }>
                                            <li class="link">
                                                <a href="components/ClassEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClassEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConditionEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConditionEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfiguratorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfiguratorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FlexEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FlexEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HtmlEditorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HtmlEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PaletteComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaletteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ToolbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToolbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TreeComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DynamicViewsModule.html" data-type="entity-link" >DynamicViewsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DynamicViewsModule-d933df17aa34f28e16aa4d6d50f3d531a1eca211f3ada68bb03124bd40c69d3e119a4c42cec74a099613b22698c5ca4797e5d61d60f3dc1220e99bcc7957c3d9"' : 'data-target="#xs-components-links-module-DynamicViewsModule-d933df17aa34f28e16aa4d6d50f3d531a1eca211f3ada68bb03124bd40c69d3e119a4c42cec74a099613b22698c5ca4797e5d61d60f3dc1220e99bcc7957c3d9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DynamicViewsModule-d933df17aa34f28e16aa4d6d50f3d531a1eca211f3ada68bb03124bd40c69d3e119a4c42cec74a099613b22698c5ca4797e5d61d60f3dc1220e99bcc7957c3d9"' :
                                            'id="xs-components-links-module-DynamicViewsModule-d933df17aa34f28e16aa4d6d50f3d531a1eca211f3ada68bb03124bd40c69d3e119a4c42cec74a099613b22698c5ca4797e5d61d60f3dc1220e99bcc7957c3d9"' }>
                                            <li class="link">
                                                <a href="components/ItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ZoneComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ZoneComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-DynamicViewsModule-d933df17aa34f28e16aa4d6d50f3d531a1eca211f3ada68bb03124bd40c69d3e119a4c42cec74a099613b22698c5ca4797e5d61d60f3dc1220e99bcc7957c3d9"' : 'data-target="#xs-pipes-links-module-DynamicViewsModule-d933df17aa34f28e16aa4d6d50f3d531a1eca211f3ada68bb03124bd40c69d3e119a4c42cec74a099613b22698c5ca4797e5d61d60f3dc1220e99bcc7957c3d9"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-DynamicViewsModule-d933df17aa34f28e16aa4d6d50f3d531a1eca211f3ada68bb03124bd40c69d3e119a4c42cec74a099613b22698c5ca4797e5d61d60f3dc1220e99bcc7957c3d9"' :
                                            'id="xs-pipes-links-module-DynamicViewsModule-d933df17aa34f28e16aa4d6d50f3d531a1eca211f3ada68bb03124bd40c69d3e119a4c42cec74a099613b22698c5ca4797e5d61d60f3dc1220e99bcc7957c3d9"' }>
                                            <li class="link">
                                                <a href="pipes/ConditionPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConditionPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SvgIconsModule.html" data-type="entity-link" >SvgIconsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SvgIconsModule-9bbda9a3df2b55f3ff4cc4c9ad35d1ce4bfc028324560230c4c9451e433c3da5696df41af93e31e5a8acfa9b8ffab279b90ab5b45da0fe072bd36052c7ecdee8"' : 'data-target="#xs-components-links-module-SvgIconsModule-9bbda9a3df2b55f3ff4cc4c9ad35d1ce4bfc028324560230c4c9451e433c3da5696df41af93e31e5a8acfa9b8ffab279b90ab5b45da0fe072bd36052c7ecdee8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SvgIconsModule-9bbda9a3df2b55f3ff4cc4c9ad35d1ce4bfc028324560230c4c9451e433c3da5696df41af93e31e5a8acfa9b8ffab279b90ab5b45da0fe072bd36052c7ecdee8"' :
                                            'id="xs-components-links-module-SvgIconsModule-9bbda9a3df2b55f3ff4cc4c9ad35d1ce4bfc028324560230c4c9451e433c3da5696df41af93e31e5a8acfa9b8ffab279b90ab5b45da0fe072bd36052c7ecdee8"' }>
                                            <li class="link">
                                                <a href="components/SvgIconComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SvgIconComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UtilsModule.html" data-type="entity-link" >UtilsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UtilsModule-cfe0bfb685df2b391a2f671dac187faf3cee42ed4d2ef33a10ed5ccfa92f15528aed2e1874c21fdd535daa7f3c0e9730235418800b8df7d047fb3ff4ff387afa"' : 'data-target="#xs-components-links-module-UtilsModule-cfe0bfb685df2b391a2f671dac187faf3cee42ed4d2ef33a10ed5ccfa92f15528aed2e1874c21fdd535daa7f3c0e9730235418800b8df7d047fb3ff4ff387afa"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UtilsModule-cfe0bfb685df2b391a2f671dac187faf3cee42ed4d2ef33a10ed5ccfa92f15528aed2e1874c21fdd535daa7f3c0e9730235418800b8df7d047fb3ff4ff387afa"' :
                                            'id="xs-components-links-module-UtilsModule-cfe0bfb685df2b391a2f671dac187faf3cee42ed4d2ef33a10ed5ccfa92f15528aed2e1874c21fdd535daa7f3c0e9730235418800b8df7d047fb3ff4ff387afa"' }>
                                            <li class="link">
                                                <a href="components/AutocompleteComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AutocompleteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ToastComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToastComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-UtilsModule-cfe0bfb685df2b391a2f671dac187faf3cee42ed4d2ef33a10ed5ccfa92f15528aed2e1874c21fdd535daa7f3c0e9730235418800b8df7d047fb3ff4ff387afa"' : 'data-target="#xs-directives-links-module-UtilsModule-cfe0bfb685df2b391a2f671dac187faf3cee42ed4d2ef33a10ed5ccfa92f15528aed2e1874c21fdd535daa7f3c0e9730235418800b8df7d047fb3ff4ff387afa"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-UtilsModule-cfe0bfb685df2b391a2f671dac187faf3cee42ed4d2ef33a10ed5ccfa92f15528aed2e1874c21fdd535daa7f3c0e9730235418800b8df7d047fb3ff4ff387afa"' :
                                        'id="xs-directives-links-module-UtilsModule-cfe0bfb685df2b391a2f671dac187faf3cee42ed4d2ef33a10ed5ccfa92f15528aed2e1874c21fdd535daa7f3c0e9730235418800b8df7d047fb3ff4ff387afa"' }>
                                        <li class="link">
                                            <a href="directives/NgModelChangeDebouncedDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NgModelChangeDebouncedDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/TemplateNameDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TemplateNameDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/TooltipDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TooltipDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ClassEditorComponent.html" data-type="entity-link" >ClassEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConditionEditorComponent.html" data-type="entity-link" >ConditionEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FlexEditorComponent.html" data-type="entity-link" >FlexEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HtmlEditorComponent.html" data-type="entity-link" >HtmlEditorComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/SvgIcon.html" data-type="entity-link" >SvgIcon</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ConditionsService.html" data-type="entity-link" >ConditionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigService.html" data-type="entity-link" >ConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigurableService.html" data-type="entity-link" >ConfigurableService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DragDropService.html" data-type="entity-link" >DragDropService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SvgIconRegistry.html" data-type="entity-link" >SvgIconRegistry</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ToastService.html" data-type="entity-link" >ToastService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ComponentConfig.html" data-type="entity-link" >ComponentConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ComponentCreator.html" data-type="entity-link" >ComponentCreator</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Condition.html" data-type="entity-link" >Condition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConditionValue.html" data-type="entity-link" >ConditionValue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfigModal.html" data-type="entity-link" >ConfigModal</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Configurable.html" data-type="entity-link" >Configurable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfiguratorContext.html" data-type="entity-link" >ConfiguratorContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfiguratorOptions.html" data-type="entity-link" >ConfiguratorOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ContainerConfig.html" data-type="entity-link" >ContainerConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ContainerIndex.html" data-type="entity-link" >ContainerIndex</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FlexOption.html" data-type="entity-link" >FlexOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaletteItem.html" data-type="entity-link" >PaletteItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaletteOptions.html" data-type="entity-link" >PaletteOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SVG_CONFIG.html" data-type="entity-link" >SVG_CONFIG</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SvgIconType.html" data-type="entity-link" >SvgIconType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UIBuilderIcon.html" data-type="entity-link" >UIBuilderIcon</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});