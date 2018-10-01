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

/**
 * Guesses a component type based on a value
 *
 * @example
 *     getComponentFromValue(
 *         'address',
 *         '2 Baker Street',
 *         { number: NumberField, String: StringField }
 *     );
 *     // <StringField source="address" />
 *
 * @param {String} name Property name, e.g. 'date_of_birth'
 * @param {mixed} value a value from which to determine the type, e.g. 12
 * @param {Object} types A set of components indexed by type
 */
const getComponentFromValue = (name, value, types = defaultTypes) => {
    if (name === 'id') {
        return <types.id source={name} />;
    }
    if (name.substr(name.length - 3) === '_id') {
        const reference = name.substr(0, name.length - 3) + 's';
        return (
            <types.reference source={name} reference={reference}>
                <types.id source="id" />
            </types.reference>
        );
    }
    if (name.substr(name.length - 4) === '_ids') {
        const reference = name.substr(0, name.length - 4) + 's';
        return (
            <types.referenceArray source={name} reference={reference}>
                <types.id source="id" />
            </types.referenceArray>
        );
    }
    if (value == null) {
        // FIXME introspect further using name
        return <types.string source={name} />;
    }
    if (isArray(value)) {
        if (isObject(value[0])) {
            const leafValues = getValuesFromRecords(value);
            return (
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
            );
        }
        // FIXME introspect further
        return <types.string source={name} />;
    }
    if (isBoolean(value)) {
        return <types.boolean source={name} />;
    }
    if (isDate(value)) {
        return <types.date source={name} />;
    }
    if (isString(value)) {
        if (name === 'email') {
            return <types.email source={name} />;
        }
        if (name === 'url') {
            return <types.url source={name} />;
        }
        if (isDateString(value)) {
            return <types.date source={name} />;
        }
        if (isHtml(value)) {
            return <types.richText source={name} />;
        }
        return <types.string source={name} />;
    }
    if (isInteger(value) || isNumeric(value)) {
        return <types.number source={name} />;
    }
    if (isObject(value)) {
        // we need to go deeper
        // Arbitrarily, choose the first prop of the first object
        const propName = Object.keys(value).shift();
        const leafValue = value[propName];
        return getComponentFromValue(`${name}.${propName}`, leafValue, types);
    }
};

export default getComponentFromValue;
