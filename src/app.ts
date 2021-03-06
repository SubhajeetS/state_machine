import * as joint from '../vendor/rappid';
import * as _ from 'lodash';
import {StencilService} from './services/stencil-service';
import {ToolbarService} from './services/toolbar-service';
import {InspectorService} from './services/inspector-service';
import {HaloService} from './services/halo-service';
import {KeyboardService} from './services/keyboard-service';
import * as appShapes from './shapes/app-shapes';

class App {

    el: Element;

    graph: joint.dia.Graph;
    paper: joint.dia.Paper;
    paperScroller: joint.ui.PaperScroller;

    commandManager: joint.dia.CommandManager;
    snaplines: joint.ui.Snaplines;
    clipboard: joint.ui.Clipboard;
    selection: joint.ui.Selection;
    navigator: joint.ui.Navigator;

    stencilService: StencilService;
    toolbarService: ToolbarService;
    inspectorService: InspectorService;
    haloService: HaloService;
    keyboardService: KeyboardService;

    constructor(
        el: Element,
        stencilService: StencilService,
        toolbarService: ToolbarService,
        inspectorService: InspectorService,
        haloService: HaloService,
        keyboardService: KeyboardService
    ) {
        this.el = el;

        // apply current joint js theme
        const view = new joint.mvc.View({ el });
        view.delegateEvents({
            'mouseup input[type="range"]': (evt) => evt.target.blur()
        });

        this.stencilService = stencilService;
        this.toolbarService = toolbarService;
        this.inspectorService = inspectorService;
        this.haloService = haloService;
        this.keyboardService = keyboardService;
    }

    createBuilder() {

        joint.setTheme('material');

        this.initializePaper();
        this.initializeStencil();
        this.initializeSelection();
        this.initializeToolsAndInspector();
        this.initializeNavigator();
        this.initializeToolbar();
        this.initializeKeyboardShortcuts();
        this.initializeTooltips();
        this.loadSavedWorkflow();
    }

    async loadSavedWorkflow () {
        const json = await localStorage.getItem('cli:workflow');
        if(json){
            this.graph.fromJSON(JSON.parse(json));
        }
    }

    initializePaper() {
        //todo: clean up - are app shapes required
        const graph = this.graph = new joint.dia.Graph({}, {
            cellNamespace: appShapes
        });

        //create a inspector for each added component
        graph.on('add', (cell: joint.dia.Cell, collection: any, opt: any) => {
            if (opt.stencil) this.inspectorService.create(cell);
        });

        //todo: what does it do
        this.commandManager = new joint.dia.CommandManager({ graph: graph });

        const paper = this.paper = new joint.dia.Paper({
            width: 1000,
            height: 1000,
            gridSize: 8,
            drawGrid: true,
            model: graph,
            cellViewNamespace: appShapes,
            defaultLink: <joint.dia.Link>new appShapes.workflow.Link(),
            defaultConnectionPoint: appShapes.workflow.Link.connectionPoint,
            interactive: { linkMove: false },
            async: true,
            sorting: joint.dia.Paper.sorting.APPROX
        });

        paper.on('blank:mousewheel', _.partial(this.onMousewheel, null), this);
        paper.on('cell:mousewheel', this.onMousewheel.bind(this));

        this.snaplines = new joint.ui.Snaplines({ paper: paper });

        const paperScroller = this.paperScroller = new joint.ui.PaperScroller({
            paper,
            autoResizePaper: true,
            cursor: 'grab'
        });

        this.renderPlugin('.paper-container', paperScroller);
        paperScroller.render().center();
    }

    initializeStencil() {

        this.stencilService.create(this.paperScroller, this.snaplines);
        this.renderPlugin('.stencil-container', this.stencilService.stencil);
        this.stencilService.setShapes();
    }

    initializeSelection() {

        this.clipboard = new joint.ui.Clipboard();
        this.selection = new joint.ui.Selection({ paper: this.paper, useModelGeometry: true });
        this.selection.collection.on('reset add remove', this.onSelectionChange.bind(this));

        const keyboard = this.keyboardService.keyboard;

        // Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
        // Otherwise, initiate paper pan.
        this.paper.on('blank:pointerdown', (evt: joint.dia.Event, x: number, y: number) => {

            if (keyboard.isActive('shift', evt)) {
                this.selection.startSelecting(evt);
            } else {
                this.selection.collection.reset([]);
                this.paperScroller.startPanning(evt);
                this.paper.removeTools();
            }
        });

        this.paper.on('element:pointerdown', (elementView: joint.dia.ElementView, evt: joint.dia.Event) => {

            // Select an element if CTRL/Meta key is pressed while the element is clicked.
            if (keyboard.isActive('ctrl meta', evt)) {
                this.selection.collection.add(elementView.model);
            }

        });

        this.selection.on('selection-box:pointerdown', (elementView: joint.dia.ElementView, evt: joint.dia.Event) => {

            // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
            if (keyboard.isActive('ctrl meta', evt)) {
                this.selection.collection.remove(elementView.model);
            }

        }, this);
    }

    onSelectionChange() {
        const { paper, selection } = this;
        const { collection } = selection;
        paper.removeTools();
        joint.ui.Halo.clear(paper);
        joint.ui.FreeTransform.clear(paper);
        joint.ui.Inspector.close();
        if (collection.length === 1) {
            const primaryCell: joint.dia.Cell = collection.first();
            const primaryCellView = paper.requireView(primaryCell);
            selection.destroySelectionBox(primaryCell);
            this.selectPrimaryCell(primaryCellView);
        } else if (collection.length === 2) {
            collection.each(function(cell) {
                selection.createSelectionBox(cell);
            });
        }
    }

    selectPrimaryCell(cellView: joint.dia.CellView) {
        const cell = cellView.model
        if (cell.isElement()) {
            this.selectPrimaryElement(<joint.dia.ElementView>cellView);
        } else {
            this.selectPrimaryLink(<joint.dia.LinkView>cellView);
        }
        this.inspectorService.create(cell);
    }

    selectPrimaryElement(elementView: joint.dia.ElementView) {

        const element = elementView.model;

        new joint.ui.FreeTransform({
            cellView: elementView,
            allowRotation: false,
            preserveAspectRatio: !!element.get('preserveAspectRatio'),
            allowOrthogonalResize: element.get('allowOrthogonalResize') !== false
        }).render();

        this.haloService.create(elementView);
    }

    selectPrimaryLink(linkView: joint.dia.LinkView) {

        const ns = joint.linkTools;
        const toolsView = new joint.dia.ToolsView({
            name: 'link-pointerdown',
            tools: [
                new ns.Vertices(),
                new ns.SourceAnchor(),
                new ns.TargetAnchor(),
                new ns.SourceArrowhead(),
                new ns.TargetArrowhead(),
                new ns.Segments,
                new ns.Boundary({ padding: 15 }),
                new ns.Remove({ offset: -20, distance: 40 })
            ]
        });

        linkView.addTools(toolsView);
    }

    initializeToolsAndInspector() {

        this.paper.on('cell:pointerup', (cellView: joint.dia.CellView) => {
            const cell = cellView.model;
            const { collection } = this.selection;
            if (collection.includes(cell)) return;
            collection.reset([cell]);
        });

        this.paper.on('link:mouseenter', (linkView: joint.dia.LinkView) => {

            // Open tool only if there is none yet
            if (linkView.hasTools()) return;

            const ns = joint.linkTools;
            const toolsView = new joint.dia.ToolsView({
                name: 'link-hover',
                tools: [
                    new ns.Vertices({ vertexAdding: false }),
                    new ns.SourceArrowhead(),
                    new ns.TargetArrowhead()
                ]
            });

            linkView.addTools(toolsView);
        });

        this.paper.on('link:mouseleave', (linkView: joint.dia.LinkView) => {

            // Remove only the hover tool, not the pointerdown tool
            if (linkView.hasTools('link-hover')) {
                linkView.removeTools();
            }
        });

        this.graph.on('change', (cell: joint.dia.Cell, opt: any ) => {

            if (!cell.isLink() || !opt.inspector) return;

            const ns = joint.linkTools;
            const toolsView = new joint.dia.ToolsView({
                name: 'link-inspected',
                tools: [
                    new ns.Boundary({ padding: 15 }),
                ]
            });

            cell.findView(this.paper).addTools(toolsView);
        });
    }

    initializeNavigator() {

        const navigator = this.navigator = new joint.ui.Navigator({
            width: 240,
            height: 115,
            paperScroller: this.paperScroller,
            zoom: false,
            paperOptions: {
                async: true,
                elementView: appShapes.NavigatorElementView,
                linkView: appShapes.NavigatorLinkView,
                cellViewNamespace: { /* no other views are accessible in the navigator */ }
            }
        });

        this.renderPlugin('.navigator-container', navigator);
    }

    initializeToolbar() {

        this.toolbarService.create(this.commandManager, this.paperScroller);

        this.toolbarService.toolbar.on({
            'png:pointerclick': this.openAsPNG.bind(this),
            'clear:pointerclick': this.graph.clear.bind(this.graph),
            'print:pointerclick': this.paper.print.bind(this.paper),
            'grid-size:change': this.paper.setGridSize.bind(this.paper),
            'save:pointerclick': this.saveDiagram.bind(this),
        });

        this.renderPlugin('.toolbar-container', this.toolbarService.toolbar);
    }

    saveDiagram() {
        const jsonString = JSON.stringify(this.graph.toJSON());
        console.log(jsonString);
        localStorage.setItem('cli:workflow', jsonString);
    }

    initializeKeyboardShortcuts() {

        this.keyboardService.create(
            this.graph, this.clipboard, this.selection, this.paperScroller, this.commandManager);
    }

    initializeTooltips(): joint.ui.Tooltip {

        return new joint.ui.Tooltip({
            rootTarget: document.body,
            target: '[data-tooltip]',
            direction: joint.ui.Tooltip.TooltipArrowPosition.Auto,
            padding: 10
        });
    }

    openAsPNG() {

        this.paper.hideTools().toPNG((dataURL: string) => {
            new joint.ui.Lightbox({
                image: dataURL,
                downloadable: true,
                fileName: 'Workflow'
            }).open();
            this.paper.showTools();
        }, { padding: 10 });
    }

    onMousewheel(cellView: joint.dia.CellView, evt: joint.dia.Event, ox: number, oy: number, delta: number) {

        if (this.keyboardService.keyboard.isActive('alt', evt)) {
            evt.preventDefault();
            this.paperScroller.zoom(delta * 0.2, { min: 0.2, max: 5, grid: 0.2, ox, oy });
        }
    }

    renderPlugin(selector: string, plugin: any): void {

        this.el.querySelector(selector).appendChild(plugin.el);
        plugin.render();
    }
}

export default App;
