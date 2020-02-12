import {ui, dia} from '../../vendor/rappid';
import * as appShapes from '../shapes/app-shapes';

export class StencilService {

    stencil: ui.Stencil;

    create(paperScroller: ui.PaperScroller, snaplines: ui.Snaplines) {

        this.stencil = new ui.Stencil({
            paper: paperScroller,
            snaplines: snaplines,
            width: 240,
            groups: this.getStencilGroups(),
            dropAnimation: true,
            groupsToggleButtons: true,
            paperOptions: function () {
                return {
                    model: new dia.Graph({},{
                        cellNamespace: appShapes
                    }),
                    cellViewNamespace: appShapes
                };
            },
            search: {
                '*': ['type', 'attrs/text/text', 'attrs/root/dataTooltip', 'attrs/label/text'],
                'org.Member': ['attrs/.rank/text', 'attrs/root/dataTooltip', 'attrs/.name/text']
            },
            // Use default Grid Layout
            layout: true,
            // Remove tooltip definition from clone
            dragStartClone: cell => cell.clone().removeAttr('root/dataTooltip')
        });
    }

    setShapes() {
        this.stencil.load(this.getStencilShapes());
    }

    getStencilGroups() {
        return <{ [key: string]: ui.Stencil.Group }>{
            stateDiagram: { index: 1, label: 'State Diagram' },
        };
    }

    getStencilShapes() {
        return {
            stateDiagram: [
                {
                    type: 'workflow.StartState',
                    preserveAspectRatio: true,
                    attrs: {
                        root: {
                            dataTooltip: 'Start State',
                            dataTooltipPosition: 'left',
                            dataTooltipPositionSelector: '.joint-stencil'
                        },
                        circle: {
                            width: 2,
                            height: 2,
                            fill: '#61549c',
                            'stroke-width': 0
                        },
                    }
                },
                {
                    type: 'workflow.EndState',
                    preserveAspectRatio: true,
                    attrs: {
                        root: {
                            dataTooltip: 'End State',
                            dataTooltipPosition: 'left',
                            dataTooltipPositionSelector: '.joint-stencil'
                        },
                        '.inner': {
                            fill: '#6a6c8a',
                            stroke: 'transparent'
                        },
                        '.outer': {
                            fill: 'transparent',
                            stroke: '#61549c',
                            'stroke-width': 2,
                            'stroke-dasharray': '0'
                        }
                    }
                },
                {
                    type: 'workflow.Branch',
                    size: { width: 2, height: 1 },
                    attrs: {
                        root: {
                            dataTooltip: 'Branch',
                            dataTooltipPosition: 'left',
                            dataTooltipPositionSelector: '.joint-stencil'
                        }
                    }
                },
                {
                    type: 'workflow.State',
                    size: {
                        width: 150,
                        height: 100
                    },
                    attrs: {
                        root: {
                            dataTooltip: 'State',
                            dataTooltipPosition: 'left',
                            dataTooltipPositionSelector: '.joint-stencil'
                        }
                    }
                }
            ]
        };
    }
}
