import React from 'react';
import getComponentFromValue from './getComponentFromValue';

describe('getComponentFromValue', () => {
    function Good() {}
    function Bad() {}
    function Dummy() {}

    it('should return an id field for field named id', () => {
        const types = {
            id: Good,
            string: Bad,
        };
        expect(getComponentFromValue('id', 'foo', types)).toEqual(
            <Good source="id" />
        );
    });
    it('should return a reference field for field named *_id', () => {
        const types = {
            reference: Good,
            string: Bad,
            id: Dummy,
        };
        expect(getComponentFromValue('foo_id', 'foo', types)).toEqual(
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
        expect(getComponentFromValue('foo_ids', 'foo', types)).toEqual(
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
        expect(getComponentFromValue('foo', null, types)).toEqual(
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
            getComponentFromValue('foo', [{ bar: 1 }, { bar: 2 }], types)
        ).toEqual(<Good source="foo">{[<Dummy key="0" source="bar" />]}</Good>);
    });
    it('should return a string field for array of non-object values', () => {
        const types = {
            array: Bad,
            string: Good,
        };
        expect(getComponentFromValue('foo', [1, 2], types)).toEqual(
            <Good source="foo" />
        );
    });
    it('should return a boolean field for boolean values', () => {
        const types = {
            boolean: Good,
            string: Bad,
        };
        expect(getComponentFromValue('foo', true, types)).toEqual(
            <Good source="foo" />
        );
        expect(getComponentFromValue('foo', false, types)).toEqual(
            <Good source="foo" />
        );
    });
    it('should return a date field for date values', () => {
        const types = {
            date: Good,
            string: Bad,
        };
        expect(
            getComponentFromValue('foo', new Date('2018-10-01'), types)
        ).toEqual(<Good source="foo" />);
    });
    it('should return an email field for email name', () => {
        const types = {
            email: Good,
            string: Bad,
        };
        expect(getComponentFromValue('email', 'whatever', types)).toEqual(
            <Good source="email" />
        );
    });
    it.skip('should return an email field for email string values', () => {
        const types = {
            email: Good,
            string: Bad,
        };
        expect(getComponentFromValue('foo', 'me@example.com', types)).toEqual(
            <Good source="foo" />
        );
    });
    it('should return an url field for url name', () => {
        const types = {
            url: Good,
            string: Bad,
        };
        expect(getComponentFromValue('url', 'whatever', types)).toEqual(
            <Good source="url" />
        );
    });
    it.skip('should return an url field for url string values', () => {
        const types = {
            url: Good,
            string: Bad,
        };
        expect(
            getComponentFromValue('foo', 'http://foo.com/bar', types)
        ).toEqual(<Good source="foo" />);
    });
    it('should return a date field for date string values', () => {
        const types = {
            date: Good,
            string: Bad,
        };
        expect(getComponentFromValue('foo', '2018-10-01', types)).toEqual(
            <Good source="foo" />
        );
    });
    it('should return a rich text field for HTML values', () => {
        const types = {
            richText: Good,
            string: Bad,
        };
        expect(
            getComponentFromValue('foo', 'This is <h1>Good</h1>', types)
        ).toEqual(<Good source="foo" />);
    });
    it('should return a string field for string values', () => {
        const types = {
            string: Good,
            richText: Bad,
        };
        expect(getComponentFromValue('foo', 'This is Good', types)).toEqual(
            <Good source="foo" />
        );
    });
    it('should return a number field for number values', () => {
        const types = {
            number: Good,
            string: Bad,
        };
        expect(getComponentFromValue('foo', 12, types)).toEqual(
            <Good source="foo" />
        );
    });
    it('should return a typed field for object values', () => {
        const types = {
            number: Good,
            string: Bad,
        };
        expect(getComponentFromValue('foo', { bar: 1, baz: 2 }, types)).toEqual(
            <Good source="foo.bar" />
        );
    });
});
