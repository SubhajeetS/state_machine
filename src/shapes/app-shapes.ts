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
                        '.uml-class-name-rect': {
                            'top': 2,
                            'fill': '#61549c',
                            'stroke': '#f6f6f6',
                            'stroke-width': 1,
                            'rx': 8,
                            'ry': 8
                        },
                        '.uml-class-attrs-rect': {
                            'top': 2,
                            'fill': '#61549c',
                            'stroke': '#f6f6f6',
                            'stroke-width': 1,
                            'rx': 8,
                            'ry': 8
                        },
                        '.uml-class-methods-rect': {
                            'top': 2,
                            'fill': '#61549c',
                            'stroke': '#f6f6f6',
                            'stroke-width': 1,
                            'rx': 8,
                            'ry': 8
                        },            
                        '.uml-class-name-text': {
                            'ref': '.uml-class-name-rect',
                            'ref-y': .5,
                            'ref-x': .5,
                            'text-anchor': 'middle',
                            'y-alignment': 'middle',
                            'fill': '#f6f6f6',
                            'font-size': 11,
                            'font-weight': 'Normal',
                            'font-family': 'Roboto Condensed'
                        },
                        '.uml-class-attrs-text': {
                            'ref': '.uml-class-attrs-rect', 
                            'ref-y': 0.5,
                            'ref-x': 5,
                            'y-alignment': 'middle',
                            'fill': '#f6f6f6', 
                            'font-size': 11, 
                            'font-weight': 'Normal',
                            'font-family': 'Roboto Condensed'
                        },
                        '.uml-class-methods-text': {
                            'ref': '.uml-class-methods-rect', 
                            'ref-y': .5,
                            'ref-x': 5,
                            'y-alignment': 'middle',
                            'fill': '#f6f6f6', 
                            'font-size': 11, 
                            'font-weight': 'Normal',
                            'font-family': 'Roboto Condensed'
                        }
                    },          
                    name: [],
                    attributes: [],
                    methods: []
                }, Generic.prototype.defaults);
        }

        markup =
            `<g class="rotatable">
                <g class="scalable">
                    <rect class="uml-class-name-rect"/>
                    <rect class="uml-class-attrs-rect"/>
                    <rect class="uml-class-methods-rect"/>
                    <rect class="uml-class-name-rect"/>
                    <rect class="uml-class-attrs-rect"/>
                    <rect class="uml-class-methods-rect"/>
                </g>
                <text class="uml-class-name-text"/>
                <text class="uml-class-attrs-text"/>
                <text class="uml-class-methods-text"/>
            </g>`;

        initialize() {
            this.on('change:name change:attributes change:methods', () => {
                this.updateRectangles();
                this.trigger('uml-update');
            }, this);

            this.updateRectangles();

            Generic.prototype.initialize.apply(this, arguments);
        }

        getClassName() {
            return this.get('name');
        }

        updateRectangles() {
            var attrs = this.get('attrs');

            var rects = [
                { type: 'name', text: this.getClassName() },
                { type: 'attrs', text: this.get('attributes') },
                { type: 'methods', text: this.get('methods') }
            ];

            var offsetY = 0;

            rects.forEach(function(rect) {

                var lines = Array.isArray(rect.text) ? rect.text : [rect.text];
                var rectHeight = lines.length * 20 + 20;

                attrs['.uml-class-' + rect.type + '-text'].text = lines.join('\n');
                attrs['.uml-class-' + rect.type + '-rect'].height = rectHeight;
                attrs['.uml-class-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

                offsetY += rectHeight;
            });
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

