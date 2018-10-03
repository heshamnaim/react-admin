import React from 'react';
import getComponentFromValues from './getComponentFromValues';

describe('getComponentFromValues', () => {
    function Good() {}
    function Bad() {}
    function Dummy() {}

    it('should fall back to the nearest type if type is absent', () => {
        const types = {
            string: Good,
        };
        expect(getComponentFromValues('id', ['foo'], types)).toEqual(
            <Good source="id" />
        );
    });
    it('should return null if type is falsy', () => {
        const types = {
            id: false,
            string: Bad,
        };
        expect(getComponentFromValues('id', ['foo'], types)).toEqual(false);
    });
    it('should return an id field for field named id', () => {
        const types = {
            id: Good,
            string: Bad,
        };
        expect(getComponentFromValues('id', ['foo', 'bar'], types)).toEqual(
            <Good source="id" />
        );
    });
    it('should return a reference field for field named *_id', () => {
        const types = {
            reference: Good,
            string: Bad,
            id: Dummy,
        };
        expect(getComponentFromValues('foo_id', ['foo', 'bar'], types)).toEqual(
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
            getComponentFromValues('foo_ids', ['foo', 'bar'], types)
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
        expect(getComponentFromValues('foo', [], types)).toEqual(
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
            getComponentFromValues(
                'foo',
                [[{ bar: 1 }, { bar: 2 }], [{ bar: 3 }, { bar: 4 }]],
                types
            )
        ).toEqual(<Good source="foo">{[<Dummy key="0" source="bar" />]}</Good>);
    });
    it('should return a string field for array of non-object values', () => {
        const types = {
            array: Bad,
            string: Good,
        };
        expect(getComponentFromValues('foo', [[1, 2], [3, 4]], types)).toEqual(
            <Good source="foo" />
        );
    });
    it('should return a boolean field for boolean values', () => {
        const types = {
            boolean: Good,
            string: Bad,
        };
        expect(
            getComponentFromValues('foo', [true, false, true], types)
        ).toEqual(<Good source="foo" />);
    });
    it('should return a date field for date values', () => {
        const types = {
            date: Good,
            string: Bad,
        };
        expect(
            getComponentFromValues(
                'foo',
                [new Date('2018-10-01'), new Date('2018-12-03')],
                types
            )
        ).toEqual(<Good source="foo" />);
    });
    it('should return an email field for email name', () => {
        const types = {
            email: Good,
            string: Bad,
        };
        expect(getComponentFromValues('email', ['whatever'], types)).toEqual(
            <Good source="email" />
        );
    });
    it.skip('should return an email field for email string values', () => {
        const types = {
            email: Good,
            string: Bad,
        };
        expect(
            getComponentFromValues(
                'foo',
                ['me@example.com', 'you@foo.co.uk'],
                types
            )
        ).toEqual(<Good source="foo" />);
    });
    it('should return an url field for url name', () => {
        const types = {
            url: Good,
            string: Bad,
        };
        expect(
            getComponentFromValues('url', ['whatever', 'whatever'], types)
        ).toEqual(<Good source="url" />);
    });
    it.skip('should return an url field for url string values', () => {
        const types = {
            url: Good,
            string: Bad,
        };
        expect(
            getComponentFromValues(
                'foo',
                ['http://foo.com/bar', 'https://www.foo.com/index.html#foo'],
                types
            )
        ).toEqual(<Good source="foo" />);
    });
    it('should return a date field for date string values', () => {
        const types = {
            date: Good,
            string: Bad,
        };
        expect(
            getComponentFromValues('foo', ['2018-10-01', '2018-12-03'], types)
        ).toEqual(<Good source="foo" />);
    });
    it('should return a rich text field for HTML values', () => {
        const types = {
            richText: Good,
            string: Bad,
        };
        expect(
            getComponentFromValues(
                'foo',
                ['This is <h1>Good</h1>', '<body><h1>hello</h1>World</body>'],
                types
            )
        ).toEqual(<Good source="foo" />);
    });
    it('should return a string field for string values', () => {
        const types = {
            string: Good,
            richText: Bad,
        };
        expect(
            getComponentFromValues(
                'foo',
                ['This is Good', 'hello, World!'],
                types
            )
        ).toEqual(<Good source="foo" />);
    });
    it('should return a number field for number values', () => {
        const types = {
            number: Good,
            string: Bad,
        };
        expect(
            getComponentFromValues('foo', [12, 1e23, 653.56], types)
        ).toEqual(<Good source="foo" />);
    });
    it('should return a typed field for object values', () => {
        const types = {
            number: Good,
            string: Bad,
        };
        expect(
            getComponentFromValues(
                'foo',
                [{ bar: 1, baz: 2 }, { bar: 3, baz: 4 }],
                types
            )
        ).toEqual(<Good source="foo.bar" />);
    });
});
