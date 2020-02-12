import * as joint from '../../vendor/rappid';
import { memoize } from 'lodash';

const { Generic } = joint.shapes.basic;
export namespace workflow {
    export class Link extends joint.shapes.standard.Link {

        defaults() {
            return joint.util.defaultsDeep({
                type: 'workflow.Link',
                router: {
                    name: 'normal'
                },
                connector: {
                    name: 'rounded'
                },
                labels: [],
                attrs: {
                    line: {
                        stroke: '#8f8f8f',
                        strokeDasharray: '0',
                        strokeWidth: 2,
                        fill: 'none',
                        sourceMarker: {
                            type: 'path',
                            d: 'M 0 0 0 0',
                            stroke: 'none'
                        },
                        targetMarker: {
                            type: 'path',
                            d: 'M 0 -5 -10 0 0 5 z',
                            stroke: 'none'
                        }
                    }
                },
                transitionType: 'manual',
                priority: 1,
                precondition: ''
            }, 
            joint.shapes.standard.Link.prototype.defaults);
        }

        defaultLabel = {
            attrs: {
                rect: {
                    fill: '#ffffff',
                    stroke: '#8f8f8f',
                    strokeWidth: 1,
                    refWidth: 10,
                    refHeight: 10,
                    refX: -5,
                    refY: -5
                }
            }
        };

        labelMarkup = 
            `<path 
                d="m 200,200 5,0 c 6,0 10,0 14,-1 4,-1 8,-4 11,-8 3,-4 4,-8 5,-13 1,-5 1,-14 1,-26 0,-9 0,-15 1,-20 1,-5 3,-10 6,-13 3,-3 7,-5 13,-5 l 0,-16 c -6,0 -10,-2 -13,-5 -3,-3 -5,-8 -6,-13 -1,-5 -1,-11 -1,-20 0,-12 0,-21 -1,-26 -1,-5 -2,-9 -5,-13 -3,-4 -7,-7 -11,-8 -4,-1 -8,-1 -14,-1 l -5,0 0,15 3,0 c 7,0 11,1 13,3 3,3 4,4 4,7 l 0,25 c 0,15 2,25 5,31 3,6 9,10 15,13 -6,3 -12,7 -15,13 -3,6 -5,16 -5,31 l 0,25 c 0,3 -1,4 -4,7 -2,2 -6,3 -13,3 l -3,0 0,15 z" 
                    transform="scale(0.2) matrix(-1, 0, 0, 1, 260, 0)"
                />
            <text y="20" x="20"/>`;

        initialize() {
            this.on('change:precondition', this.updatePrecondtion);
            this.updatePrecondtion();
            joint.shapes.standard.Link.prototype.initialize.apply(this, arguments);
        }

        updatePrecondtion() {
            const precondition = this.get('precondition');
            if(precondition){
                this.labels([
                    { "attrs": { "text": { "text":  precondition } } , position: 0.5 }
                ]);
            } else {
                this.labels([]);
            }     
        }

        getMarkerWidth(type: any) {
            const d = (type === 'source') ? this.attr('line/sourceMarker/d') : this.attr('line/targetMarker/d');
            return this.getDataWidth(d);
        }

        getDataWidth = memoize(function (d: any) {
            return (new joint.g.Path(d)).bbox().width;
        });

        static connectionPoint(line: any, view: any, magnet: any, opt: any, type: any, linkView: any): joint.connectionPoints.GenericConnectionPoint<'boundary'> {
            const markerWidth = linkView.model.getMarkerWidth(type);
            opt = { offset: markerWidth, stroke: true };
            // connection point for UML shapes lies on the root group containg all the shapes components
            const modelType = view.model.get('type');
            // taking the border stroke-width into account
            if (modelType === 'standard.InscribedImage') opt.selector = 'border';
            return joint.connectionPoints.boundary.call(this, line, view, magnet, opt, type, linkView);
        }
    }

    export class StartState extends joint.shapes.fsa.StartState {
        defaults() {
            return joint.util.defaultsDeep({
                type: 'workflow.StartState',
                attrs: {
                    body: {
                        fill: '#fff', 
                        stroke: '#000000',
                        strokeWidth: 2,
                        strokeDasharray: '0'
                    }
                }
            }, joint.shapes.fsa.StartState.prototype.defaults);
        }
    }

    export class EndState extends joint.shapes.fsa.EndState {
        defaults() {
            return joint.util.defaultsDeep({
                type: 'workflow.EndState'
            }, joint.shapes.fsa.EndState.prototype.defaults);
        }
    }
    export class Branch extends joint.shapes.standard.Polygon {
        defaults() {

            return joint.util.defaultsDeep({
                type: 'workflow.Branch',
                attrs: {
                    body: {
                        refPoints: '50,0 100,50 50,100 0,50',
                        fill: '#fff', 
                        stroke: '#000000',
                        strokeWidth: 2,
                        strokeDasharray: '0'
                    },
                    label: {
                        fill: '#c6c7e2',
                        fontFamily: 'Roboto Condensed',
                        fontWeight: 'Normal',
                        fontSize: 11,
                        strokeWidth: 0
                    }
                }
            }, joint.shapes.standard.Polygon.prototype.defaults);
        }
    }
    export class State extends Generic {
        defaults() {
            return joint.util.defaultsDeep(
                {
                    type: 'workflow.State',
                    attrs: {
                        rect: { 'width': 200 },
                        '.state-rect': {
                            'width': 200, 
                            'height': 150, 
                            'rx': 10, 
                            'ry': 10,
                            'fill': '#fff', 
                            'stroke': '#000000', 
                            'stroke-width': 2
                        },
                        '.state-precondition': {
                            'ref': '.state-rect',
                            'ref-x': -15, 
                            'ref-y': -50, 
                            'fill': '#000000',
                            'transform': `scale(0.2) matrix(-1, 0, 0, 1, 260, 0)`,
                            'display': 'none'
                        },
                        '.state-val-text': {
                            'ref': '.state-rect',
                            'ref-x': .5, 
                            'ref-y': .3, 
                            'text-anchor': 'middle',
                            'fill': '#000000', 
                            'font-family': 'Courier New', 
                            'font-size': 14
                        },
                        '.state-precondition-text': {
                            'ref': '.state-precondition',
                            'ref-y': 10, 
                            'fill': '#000000', 
                            'font-weight': 'bold',
                            'font-family': 'Courier New', 
                            'font-size': 14
                        },
                    },
                    state: '',
                    precondition: ''
                }, Generic.prototype.defaults);
        }

        markup =
            `<g class="rotatable state-rect-container">
                <g class="scalable">
                    <rect class="state-rect"/>
                </g>
                <text class="state-val-text"/>
             </g>`;

        initialize() {
            this.on('change:state', this.updateState);
            this.updateState();
            Generic.prototype.initialize.apply(this, arguments);
        }

        updateState() {
            this.attr('.state-val-text/text', this.get('state'));
        }
    }
}

export const NavigatorElementView = joint.dia.ElementView.extend({

    body: null,

    markup: [{
        tagName: 'rect',
        selector: 'body',
        attributes: {
            'fill': '#31d0c6'
        }
    }],

    presentationAttributes: {
        position: ['TRANSLATE'],
        size: ['RESIZE'],
        angle: ['ROTATE']
    },

    render: function () {
        const { fragment, selectors: { body } } = joint.util.parseDOMJSON(this.markup);
        this.body = body;
        this.el.appendChild(fragment);
        this.updateNodesAttributes();
        this.updateTransformation();
    },

    updateNodesAttributes: function () {
        const { width, height } = this.model.get('size');
        this.body.setAttribute('width', width);
        this.body.setAttribute('height', height);
    }
});


export const NavigatorLinkView = joint.dia.LinkView.extend({

    initialize: joint.util.noop,

    render: joint.util.noop,

    update: joint.util.noop
});

// re-export build-in shapes from rappid
export const basic = joint.shapes.basic;
export const standard = joint.shapes.standard;
export const fsa = joint.shapes.fsa;
export const pn = joint.shapes.pn;
export const erd = joint.shapes.erd;
export const uml = joint.shapes.uml;
export const org = joint.shapes.org;

