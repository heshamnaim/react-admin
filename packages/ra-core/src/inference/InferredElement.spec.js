import React, { Component } from 'react';
import InferredElement from './InferredElement';

describe('InferredElement', () => {
    it('should accept null type', () => {
        const ie = new InferredElement();
        expect(ie.getElement()).toBeUndefined();
    });
    describe('getVisualRepresentation', () => {
        it('should return the visual representation when given', () => {
            const DummyComponent = () => {};
            const ie = new InferredElement(
                <DummyComponent source="foo" />,
                'bar'
            );
            expect(ie.getVisualRepresentation()).toBe('bar');
        });
        it('should return a good default visual representation for functional components', () => {
            const DummyComponent = () => {};
            const ie = new InferredElement(<DummyComponent source="foo" />);
            expect(ie.getVisualRepresentation()).toBe(
                '<DummyComponent source="foo" />'
            );
        });
        it('should return a good default visual representation for class components', () => {
            class DummyComponent extends Component {
                render() {
                    return null;
                }
            }
            const ie = new InferredElement(<DummyComponent source="foo" />);
            expect(ie.getVisualRepresentation()).toBe(
                '<DummyComponent source="foo" />'
            );
        });
    });
});
