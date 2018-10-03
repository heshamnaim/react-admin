import React, { cloneElement } from 'react';
import getValuesFromRecords from './getValuesFromRecords';
import InferredElement from './InferredElement';

import {
    isObject,
    valuesAreArray,
    valuesAreBoolean,
    valuesAreDate,
    valuesAreDateString,
    valuesAreHtml,
    valuesAreInteger,
    valuesAreNumeric,
    valuesAreObject,
    valuesAreString,
} from './assertions';

const DefaultComponent = () => <span>;</span>;

const defaultTypes = {
    array: DefaultComponent,
    boolean: DefaultComponent,
    date: DefaultComponent,
    email: DefaultComponent,
    id: DefaultComponent,
    number: DefaultComponent,
    reference: DefaultComponent,
    referenceArray: DefaultComponent,
    richText: DefaultComponent,
    string: DefaultComponent,
    url: DefaultComponent,
};

const hasType = (type, types) => typeof types[type] !== 'undefined';

/**
 * Guesses an element based on an array of values
 *
 * @example
 *     inferElementFromValues(
 *         'address',
 *         ['2 Baker Street', '1 Downing street'],
 *         { number: NumberField, string: StringField }
 *     );
 *     // new InferredElement(<StringField source="address" />)
 *
 * Types are optional: if a type isn't provided, the function falls back
 * to the neareast type.
 *
 * @example
 *     inferElementFromValues(
 *         'content',
 *         ['<h1>Hello</h1>'],
 *         { string: StringField } // no richText type
 *     );
 *     // new InferredElement(<StringField source="content" />)
 *
 * Types can be disabled by passing a falsy value.
 *
 * @example
 *     inferElementFromValues(
 *         'content',
 *         ['<h1>Hello</h1>'],
 *         { string: StringField, richText: false }
 *     );
 *     // null
 *
 * @param {String} name Property name, e.g. 'date_of_birth'
 * @param {[mixed]} values an array of values from which to determine the type, e.g. [12, 34.4, 43]
 * @param {Object} types A set of components indexed by type. The string type is the only required one
 *
 * @return InferredElement
 */
const inferElementFromValues = (name, values = [], types = defaultTypes) => {
    if (name === 'id' && hasType('id', types)) {
        return InferredElement.create(types.id, name);
    }
    if (name.substr(name.length - 3) === '_id' && hasType('reference', types)) {
        const reference = name.substr(0, name.length - 3) + 's';
        return (
            types.reference &&
            new InferredElement(
                (
                    <types.reference source={name} reference={reference}>
                        <types.id source="id" />
                    </types.reference>
                ),
                `<${
                    types.reference
                } source="${name}" reference="${reference}"><${
                    types.id
                } source="id" />><${types.reference}>`
            )
        );
    }
    if (
        name.substr(name.length - 4) === '_ids' &&
        hasType('referenceArray', types)
    ) {
        const reference = name.substr(0, name.length - 4) + 's';
        return (
            types.referenceArray &&
            new InferredElement(
                (
                    <types.referenceArray source={name} reference={reference}>
                        <types.id source="id" />
                    </types.referenceArray>
                ),
                `<${
                    types.referenceArray
                } source="${name}" reference="${reference}"><${
                    types.id
                } source="id" />><${types.referenceArray}>`
            )
        );
    }
    if (values.length == 0) {
        // FIXME introspect further using name
        return InferredElement.create(types.string, name);
    }
    if (valuesAreArray(values)) {
        if (isObject(values[0][0]) && hasType('array', types)) {
            const leafValues = getValuesFromRecords(
                values.reduce((acc, vals) => acc.concat(vals), [])
            );
            // FIXME bad visual representation
            return (
                types.array &&
                new InferredElement(
                    (
                        <types.array source={name}>
                            {Object.keys(leafValues).map((leafName, index) =>
                                cloneElement(
                                    inferElementFromValues(
                                        leafName,
                                        leafValues[leafName],
                                        types
                                    ).getElement(),
                                    { key: index }
                                )
                            )}
                        </types.array>
                    )
                )
            );
        }
        // FIXME introspect further
        return InferredElement.create(types.string, name);
    }
    if (valuesAreBoolean(values) && hasType('boolean', types)) {
        return InferredElement.create(types.boolean, name);
    }
    if (valuesAreDate(values) && hasType('date', types)) {
        return InferredElement.create(types.date, name);
    }
    if (valuesAreString(values)) {
        if (name === 'email' && hasType('email', types)) {
            return InferredElement.create(types.email, name);
        }
        if (name === 'url' && hasType('url', types)) {
            return InferredElement.create(types.url, name);
        }
        if (valuesAreDateString(values) && hasType('date', types)) {
            return InferredElement.create(types.date, name);
        }
        if (valuesAreHtml(values) && hasType('richText', types)) {
            return InferredElement.create(types.richText, name);
        }
        return InferredElement.create(types.string, name);
    }
    if (
        (valuesAreInteger(values) || valuesAreNumeric(values)) &&
        hasType('number', types)
    ) {
        return InferredElement.create(types.number, name);
    }
    if (valuesAreObject(values)) {
        // we need to go deeper
        // Arbitrarily, choose the first prop of the first object
        const propName = Object.keys(values[0]).shift();
        const leafValues = values.map(v => v[propName]);
        return inferElementFromValues(`${name}.${propName}`, leafValues, types);
    }
    return InferredElement.create(types.string, name);
};

export default inferElementFromValues;
