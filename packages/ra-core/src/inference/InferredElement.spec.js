import React, { Component } from 'react';
import InferredElement from './InferredElement';

describe('InferredElement', () => {
    describe('getVisualRepresentation', () => {
        it('should return the visual representation when given', () => {
            const DummyComponent = () => {};
            const ic = new InferredElement(
                <DummyComponent source="foo" />,
                'bar'
            );
            expect(ic.getVisualRepresentation()).toBe('bar');
        });
        it('should return a good default visual representation for functional components', () => {
            const DummyComponent = () => {};
            const ic = new InferredElement(<DummyComponent source="foo" />);
            expect(ic.getVisualRepresentation()).toBe(
                '<DummyComponent source="foo" />'
            );
        });
        it('should return a good default visual representation for class components', () => {
            class DummyComponent extends Component {
                render() {
                    return null;
                }
            }
            const ic = new InferredElement(<DummyComponent source="foo" />);
            expect(ic.getVisualRepresentation()).toBe(
                '<DummyComponent source="foo" />'
            );
        });
    });
});
