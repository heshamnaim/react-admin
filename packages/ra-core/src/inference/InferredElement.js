import { createElement } from 'react';

class InferredElement {
    constructor(element, visualRepresentation) {
        this.element = element;
        this.visualRepresentation = visualRepresentation;
    }

    getElement() {
        return this.element;
    }

    isDefined() {
        return !!this.element;
    }

    getVisualRepresentation() {
        if (!this.element) {
            return;
        }
        if (this.visualRepresentation) {
            return this.visualRepresentation;
        }
        return `<${this.element.type.displayName} source="${
            this.element.props.source
        }" />`;
    }
}

InferredElement.create = (type, name) =>
    type
        ? new InferredElement(createElement(type, { source: name }))
        : new InferredElement();

export default InferredElement;
