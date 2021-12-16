import { Compiler, CompilerFactory, COMPILER_OPTIONS, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DynamicViewsModule, ConfiguratorModule, CodeGenerationModule } from '@sinequa/ui-builder';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';

export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,

    DynamicViewsModule,
    ConfiguratorModule,
    CodeGenerationModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    {provide: COMPILER_OPTIONS, useValue: {useJit: true}, multi: true},
    {provide: CompilerFactory, useClass: JitCompilerFactory, deps: [COMPILER_OPTIONS]},
    {provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory]},    
  ]
})
export class AppModule {}
