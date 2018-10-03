import { createElement } from 'react';

class InferredElement {
    constructor(element, visualRepresentation) {
        this.element = element;
        this.visualRepresentation = visualRepresentation;
    }

    getElement() {
        return this.element;
    }

    getVisualRepresentation() {
        return (
            this.visualRepresentation ||
            `<${this.element.type.name} source="${
                this.element.props.source
            }" />`
        );
    }
}

InferredElement.create = (type, name) =>
    type ? new InferredElement(createElement(type, { source: name })) : new InferredElement();

export default InferredElement;
