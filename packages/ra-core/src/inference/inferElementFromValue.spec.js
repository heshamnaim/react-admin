import React from 'react';
import inferElementFromValue from './inferElementFromValue';
import InferredElement from './InferredElement';

describe('inferElementFromValue', () => {
    function Good() {}
    function Bad() {}
    function Dummy() {}

    it('should return an InferredElement', () => {
        const types = {
            string: Good,
        };
        expect(inferElementFromValue('id', ['foo'], types)).toBeInstanceOf(
            InferredElement
        );
    });
    it('should fall back to the nearest type if type is absent', () => {
        const types = {
            string: Good,
        };
        expect(inferElementFromValue('id', 'foo', types).getElement()).toEqual(
            <Good source="id" />
        );
    });
    it('should return null if type is falsy', () => {
        const types = {
            id: false,
            string: Bad,
        };
        expect(
            inferElementFromValue('id', 'foo', types).getElement()
        ).toBeUndefined();
    });
    it('should return an id field for field named id', () => {
        const types = {
            id: Good,
            string: Bad,
        };
        expect(inferElementFromValue('id', 'foo', types).getElement()).toEqual(
            <Good source="id" />
        );
    });
    it('should return a reference field for field named *_id', () => {
        const types = {
            reference: Good,
            string: Bad,
            id: Dummy,
        };
        expect(
            inferElementFromValue('foo_id', 'foo', types).getElement()
        ).toEqual(
            <Good source="foo_id" reference="foos">
                <Dummy source="id" />
            </Good>
        );
    });
    it('should return a reference array field for field named *_ids', () => {
        const types = {
            referenceArray: Good,
            string: Bad,
            id: Dummy,
        };
        expect(
            inferElementFromValue('foo_ids', 'foo', types).getElement()
        ).toEqual(
            <Good source="foo_ids" reference="foos">
                <Dummy source="id" />
            </Good>
        );
    });
    it('should return a string field for no values', () => {
        const types = {
            string: Good,
            number: Bad,
        };
        expect(inferElementFromValue('foo', null, types).getElement()).toEqual(
            <Good source="foo" />
        );
    });
    it('should return an array field for array of object values', () => {
        const types = {
            array: Good,
            string: Bad,
            number: Dummy,
        };
        expect(
            inferElementFromValue(
                'foo',
                [{ bar: 1 }, { bar: 2 }],
                types
            ).getElement()
        ).toEqual(<Good source="foo">{[<Dummy key="0" source="bar" />]}</Good>);
    });
    it('should return a string field for array of non-object values', () => {
        const types = {
            array: Bad,
            string: Good,
        };
        expect(
            inferElementFromValue('foo', [1, 2], types).getElement()
        ).toEqual(<Good source="foo" />);
    });
    it('should return a boolean field for boolean values', () => {
        const types = {
            boolean: Good,
            string: Bad,
        };
        expect(inferElementFromValue('foo', true, types).getElement()).toEqual(
            <Good source="foo" />
        );
        expect(inferElementFromValue('foo', false, types).getElement()).toEqual(
            <Good source="foo" />
        );
    });
    it('should return a date field for date values', () => {
        const types = {
            date: Good,
            string: Bad,
        };
        expect(
            inferElementFromValue(
                'foo',
                new Date('2018-10-01'),
                types
            ).getElement()
        ).toEqual(<Good source="foo" />);
    });
    it('should return an email field for email name', () => {
        const types = {
            email: Good,
            string: Bad,
        };
        expect(
            inferElementFromValue('email', 'whatever', types).getElement()
        ).toEqual(<Good source="email" />);
    });
    it.skip('should return an email field for email string values', () => {
        const types = {
            email: Good,
            string: Bad,
        };
        expect(
            inferElementFromValue('foo', 'me@example.com', types).getElement()
        ).toEqual(<Good source="foo" />);
    });
    it('should return an url field for url name', () => {
        const types = {
            url: Good,
            string: Bad,
        };
        expect(
            inferElementFromValue('url', 'whatever', types).getElement()
        ).toEqual(<Good source="url" />);
    });
    it.skip('should return an url field for url string values', () => {
        const types = {
            url: Good,
            string: Bad,
        };
        expect(
            inferElementFromValue(
                'foo',
                'http://foo.com/bar',
                types
            ).getElement()
        ).toEqual(<Good source="foo" />);
    });
    it('should return a date field for date string values', () => {
        const types = {
            date: Good,
            string: Bad,
        };
        expect(
            inferElementFromValue('foo', '2018-10-01', types).getElement()
        ).toEqual(<Good source="foo" />);
    });
    it('should return a rich text field for HTML values', () => {
        const types = {
            richText: Good,
            string: Bad,
        };
        expect(
            inferElementFromValue(
                'foo',
                'This is <h1>Good</h1>',
                types
            ).getElement()
        ).toEqual(<Good source="foo" />);
    });
    it('should return a string field for string values', () => {
        const types = {
            string: Good,
            richText: Bad,
        };
        expect(
            inferElementFromValue('foo', 'This is Good', types).getElement()
        ).toEqual(<Good source="foo" />);
    });
    it('should return a number field for number values', () => {
        const types = {
            number: Good,
            string: Bad,
        };
        expect(inferElementFromValue('foo', 12, types).getElement()).toEqual(
            <Good source="foo" />
        );
    });
    it('should return a typed field for object values', () => {
        const types = {
            number: Good,
            string: Bad,
        };
        expect(
            inferElementFromValue('foo', { bar: 1, baz: 2 }, types).getElement()
        ).toEqual(<Good source="foo.bar" />);
    });
});
