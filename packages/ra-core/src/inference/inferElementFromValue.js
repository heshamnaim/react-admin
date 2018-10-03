import React, { cloneElement } from 'react';
import getValuesFromRecords from './getValuesFromRecords';
import inferElementFromValues from './inferElementFromValues';
import InferredElement from './InferredElement';

import {
    isArray,
    isBoolean,
    isDate,
    isDateString,
    isHtml,
    isInteger,
    isNumeric,
    isObject,
    isString,
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
 * Guesses a component type based on a value
 *
 * @example
 *     getComponentFromValue(
 *         'address',
 *         '2 Baker Street',
 *         { number: NumberField, string: StringField }
 *     );
 *     // <StringField source="address" />
 *
 * Types are optional: if a type isn't provided, the function falls back
 * to the neareast type.
 *
 * @example
 *     getComponentFromValue(
 *         'content',
 *         '<h1>Hello</h1>',
 *         { string: StringField } // no richText type
 *     );
 *     // <StringField source="content" />
 *
 * Types can be disabled by passing a falsy value.
 *
 * @example
 *     getComponentFromValue(
 *         'content',
 *         '<h1>Hello</h1>',
 *         { string: StringField, richText: false }
 *     );
 *     // null
 *
 * @param {String} name Property name, e.g. 'date_of_birth'
 * @param {mixed} value a value from which to determine the type, e.g. 12
 * @param {Object} types A set of components indexed by type. The string type is the only required one
 *
 * @return InferredElement
 */
const getComponentFromValue = (name, value, types = defaultTypes) => {
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
    if (value == null) {
        // FIXME introspect further using name
        return InferredElement.create(types.string, name);
    }
    if (isArray(value)) {
        if (isObject(value[0]) && hasType('array', types)) {
            const leafValues = getValuesFromRecords(value);
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
    if (isBoolean(value) && hasType('boolean', types)) {
        return InferredElement.create(types.boolean, name);
    }
    if (isDate(value) && hasType('date', types)) {
        return InferredElement.create(types.date, name);
    }
    if (isString(value)) {
        if (name === 'email' && hasType('email', types)) {
            return InferredElement.create(types.email, name);
        }
        if (name === 'url' && hasType('url', types)) {
            return InferredElement.create(types.url, name);
        }
        if (isDateString(value) && hasType('date', types)) {
            return InferredElement.create(types.date, name);
        }
        if (isHtml(value) && hasType('richText', types)) {
            return InferredElement.create(types.richText, name);
        }
        return InferredElement.create(types.string, name);
    }
    if ((isInteger(value) || isNumeric(value)) && hasType('number', types)) {
        return InferredElement.create(types.number, name);
    }
    if (isObject(value)) {
        // we need to go deeper
        // Arbitrarily, choose the first prop of the first object
        const propName = Object.keys(value).shift();
        const leafValue = value[propName];
        return getComponentFromValue(`${name}.${propName}`, leafValue, types);
    }
    return InferredElement.create(types.string, name);
};

export default getComponentFromValue;
