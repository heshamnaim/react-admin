import { createElement } from 'react';

const pureRegex = /pure\((\w*)\)/;

const getComponentNameForElement = element => {
    const displayName = element.type.displayName;
    const internalName = pureRegex.exec(displayName);
    if (internalName && internalName[1]) {
        return internalName[1];
    }
    return displayName;
};

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
        return `<${getComponentNameForElement(this.element)} source="${
            this.element.props.source
        }" />`;
    }
}

InferredElement.create = (type, name) =>
    type
        ? new InferredElement(createElement(type, { source: name }))
        : new InferredElement();

export default InferredElement;
