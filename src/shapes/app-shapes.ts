import * as joint from '../../vendor/rappid';
import { memoize } from 'lodash';

const { Generic } = joint.shapes.basic;
export namespace app {

    export class CircularModel extends joint.shapes.standard.Ellipse {

        portLabelMarkup = [{
            tagName: 'text',
            selector: 'portLabel'
        }];

        defaults() {

            return joint.util.defaultsDeep({
                type: 'app.CircularModel',
                attrs: {
                    root: {
                        magnet: false
                    }
                },
                ports: {
                    groups: {
                        'in': {
                            markup: [{
                                tagName: 'circle',
                                selector: 'portBody',
                                attributes: {
                                    'r': 10
                                }
                            }],
                            attrs: {
                                portBody: {
                                    magnet: true,
                                    fill: '#61549c',
                                    strokeWidth: 0
                                },
                                portLabel: {
                                    fontSize: 11,
                                    fill: '#61549c',
                                    fontWeight: 800
                                }
                            },
                            position: {
                                name: 'ellipse',
                                args: {
                                    startAngle: 0,
                                    step: 30
                                }
                            },
                            label: {
                                position: {
                                    name: 'radial',
                                    args: null
                                }
                            }
                        },
                        'out': {
                            markup: [{
                                tagName: 'circle',
                                selector: 'portBody',
                                attributes: {
                                    'r': 10
                                }
                            }],
                            attrs: {
                                portBody: {
                                    magnet: true,
                                    fill: '#61549c',
                                    strokeWidth: 0
                                },
                                portLabel: {
                                    fontSize: 11,
                                    fill: '#61549c',
                                    fontWeight: 800
                                }
                            },
                            position: {
                                name: 'ellipse',
                                args: {
                                    startAngle: 180,
                                    step: 30
                                }
                            },
                            label: {
                                position: {
                                    name: 'radial',
                                    args: null
                                }
                            }
                        }
                    }
                }
            }, joint.shapes.standard.Ellipse.prototype.defaults);
        }
    }

    export class RectangularModel extends joint.shapes.standard.Rectangle {

        portLabelMarkup = [{
            tagName: 'text',
            selector: 'portLabel'
        }];

        defaults() {

            return joint.util.defaultsDeep({
                type: 'app.RectangularModel',
                attrs: {
                    root: {
                        magnet: false
                    }
                },
                ports: {
                    groups: {
                        'in': {
                            markup: [{
                                tagName: 'circle',
                                selector: 'portBody',
                                attributes: {
                                    'r': 10
                                }
                            }],
                            attrs: {
                                portBody: {
                                    magnet: true,
                                    fill: '#61549c',
                                    strokeWidth: 0
                                },
                                portLabel: {
                                    fontSize: 11,
                                    fill: '#61549c',
                                    fontWeight: 800
                                }
                            },
                            position: {
                                name: 'left'
                            },
                            label: {
                                position: {
                                    name: 'left',
                                    args: {
                                        y: 0
                                    }
                                }
                            }
                        },
                        'out': {
                            markup: [{
                                tagName: 'circle',
                                selector: 'portBody',
                                attributes: {
                                    'r': 10
                                }
                            }],
                            position: {
                                name: 'right'
                            },
                            attrs: {
                                portBody: {
                                    magnet: true,
                                    fill: '#61549c',
                                    strokeWidth: 0
                                },
                                portLabel: {
                                    fontSize: 11,
                                    fill: '#61549c',
                                    fontWeight: 800
                                }
                            },
                            label: {
                                position: {
                                    name: 'right',
                                    args: {
                                        y: 0
                                    }
                                }
                            }
                        }
                    }
                }
            }, joint.shapes.standard.Rectangle.prototype.defaults);
        }
    }

    export class Link extends joint.shapes.standard.Link {

        defaults() {
            return joint.util.defaultsDeep({
                type: 'app.Link',
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
                }
            }, joint.shapes.standard.Link.prototype.defaults);
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
            if (modelType.indexOf('app') === 0) opt.selector = 'root';
            // taking the border stroke-width into account
            if (modelType === 'standard.InscribedImage') opt.selector = 'border';
            return joint.connectionPoints.boundary.call(this, line, view, magnet, opt, type, linkView);
        }
    }

    export class State extends Generic {
        defaults() {
            return joint.util.defaultsDeep(
                {
                    type: 'app.State',
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
                            'ref-x': 40, 
                            'ref-y': 10, 
                            'text-anchor': 'middle',
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
            `<g class="rotatable">
                <g class="scalable">
                    <rect class="state-rect"/>
                </g>
             </g>
            <path 
                d="m 200,200 5,0 c 6,0 10,0 14,-1 4,-1 8,-4 11,-8 3,-4 4,-8 5,-13 1,-5 1,-14 1,-26 0,-9 0,-15 1,-20 1,-5 3,-10 6,-13 3,-3 7,-5 13,-5 l 0,-16 c -6,0 -10,-2 -13,-5 -3,-3 -5,-8 -6,-13 -1,-5 -1,-11 -1,-20 0,-12 0,-21 -1,-26 -1,-5 -2,-9 -5,-13 -3,-4 -7,-7 -11,-8 -4,-1 -8,-1 -14,-1 l -5,0 0,15 3,0 c 7,0 11,1 13,3 3,3 4,4 4,7 l 0,25 c 0,15 2,25 5,31 3,6 9,10 15,13 -6,3 -12,7 -15,13 -3,6 -5,16 -5,31 l 0,25 c 0,3 -1,4 -4,7 -2,2 -6,3 -13,3 l -3,0 0,15 z" 
                class= "state-precondition"
            />
            <text class="state-val-text"/>
            <text class="state-precondition-text"/>`;

        initialize() {
            this.on({
                'change:state': this.updateState,
                'change:precondition': this.updatePrecondtion,
            });
            this.updateState();
            this.updatePrecondtion();
            Generic.prototype.initialize.apply(this, arguments);
        }

        updateState() {
            this.attr('.state-val-text/text', this.get('state'));
        }

        updatePrecondtion() {
            const precondition = this.get('precondition').trim();
            this.attr('.state-precondition-text/text', precondition);
            
            if(!precondition){
                this.attr('.state-precondition/display', 'none');
            } else {
                this.attr('.state-precondition/display', 'inline');
            }
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

