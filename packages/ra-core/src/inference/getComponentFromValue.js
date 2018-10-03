import React, { cloneElement } from 'react';
import getValuesFromRecords from './getValuesFromRecords';
import getComponentFromValues from './getComponentFromValues';

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
 */
const getComponentFromValue = (name, value, types = defaultTypes) => {
    if (name === 'id' && hasType('id', types)) {
        return types.id && <types.id source={name} />;
    }
    if (name.substr(name.length - 3) === '_id' && hasType('reference', types)) {
        const reference = name.substr(0, name.length - 3) + 's';
        return (
            types.reference && (
                <types.reference source={name} reference={reference}>
                    <types.id source="id" />
                </types.reference>
            )
        );
    }
    if (
        name.substr(name.length - 4) === '_ids' &&
        hasType('referenceArray', types)
    ) {
        const reference = name.substr(0, name.length - 4) + 's';
        return (
            types.referenceArray && (
                <types.referenceArray source={name} reference={reference}>
                    <types.id source="id" />
                </types.referenceArray>
            )
        );
    }
    if (value == null) {
        // FIXME introspect further using name
        return <types.string source={name} />;
    }
    if (isArray(value)) {
        if (isObject(value[0]) && hasType('array', types)) {
            const leafValues = getValuesFromRecords(value);
            return (
                types.array && (
                    <types.array source={name}>
                        {Object.keys(leafValues).map((leafName, index) =>
                            cloneElement(
                                getComponentFromValues(
                                    leafName,
                                    leafValues[leafName],
                                    types
                                ),
                                { key: index }
                            )
                        )}
                    </types.array>
                )
            );
        }
        // FIXME introspect further
        return <types.string source={name} />;
    }
    if (isBoolean(value) && hasType('boolean', types)) {
        return types.boolean && <types.boolean source={name} />;
    }
    if (isDate(value) && hasType('date', types)) {
        return types.date && <types.date source={name} />;
    }
    if (isString(value)) {
        if (name === 'email' && hasType('email', types)) {
            return types.email && <types.email source={name} />;
        }
        if (name === 'url' && hasType('url', types)) {
            return types.url && <types.url source={name} />;
        }
        if (isDateString(value) && hasType('date', types)) {
            return types.date && <types.date source={name} />;
        }
        if (isHtml(value) && hasType('richText', types)) {
            return types.richText && <types.richText source={name} />;
        }
        return <types.string source={name} />;
    }
    if ((isInteger(value) || isNumeric(value)) && hasType('number', types)) {
        return types.number && <types.number source={name} />;
    }
    if (isObject(value)) {
        // we need to go deeper
        // Arbitrarily, choose the first prop of the first object
        const propName = Object.keys(value).shift();
        const leafValue = value[propName];
        return getComponentFromValue(`${name}.${propName}`, leafValue, types);
    }
    return <types.string source={name} />;
};

export default getComponentFromValue;
