 import * as joint from './vendor/rappid';
 
 import App from './src/app';
 
 import {StencilService} from './src/services/stencil-service';
 import {ToolbarService} from './src/services/toolbar-service';
 import {InspectorService} from './src/services/inspector-service';
 import {HaloService} from './src/services/halo-service';
 import {KeyboardService} from './src/services/keyboard-service';
 
 const app = new App(
     document.getElementById('app'),
     new StencilService(),
     new ToolbarService(),
     new InspectorService(),
     new HaloService(),
     new KeyboardService()
 );
 
 app.createBuilder();
 
 // for easier debugging in the browser's console
 declare var window: any;
 window['joint'] = joint;
 window['app'] = app;
 