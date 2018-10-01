import React, { cloneElement } from 'react';
import getValuesFromRecords from './getValuesFromRecords';

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

/**
 * Guesses a component type based on an array of values
 *
 * @example
 *     getComponentFromValues(
 *         'address',
 *         ['2 Baker Street', '1 Downing street'],
 *         { number: NumberField, String: StringField }
 *     );
 *     // <StringField source="address" />
 *
 * @param {String} name Property name, e.g. 'date_of_birth'
 * @param {[mixed]} values an array of values from which to determine the type, e.g. [12, 34.4, 43]
 * @param {Object} types A set of components indexed by type
 */
const getComponentFromValues = (name, values = [], types = defaultTypes) => {
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
    if (values.length == 0) {
        // FIXME introspect further using name
        return <types.string source={name} />;
    }
    if (valuesAreArray(values)) {
        if (isObject(values[0][0])) {
            const leafValues = getValuesFromRecords(
                values.reduce((acc, vals) => acc.concat(vals), [])
            );
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
    if (valuesAreBoolean(values)) {
        return <types.boolean source={name} />;
    }
    if (valuesAreDate(values)) {
        return <types.date source={name} />;
    }
    if (valuesAreString(values)) {
        if (name === 'email') {
            return <types.email source={name} />;
        }
        if (name === 'url') {
            return <types.url source={name} />;
        }
        if (valuesAreDateString(values)) {
            return <types.date source={name} />;
        }
        if (valuesAreHtml(values)) {
            return <types.richText source={name} />;
        }
        return <types.string source={name} />;
    }
    if (valuesAreInteger(values) || valuesAreNumeric(values)) {
        return <types.number source={name} />;
    }
    if (valuesAreObject(values)) {
        // we need to go deeper
        // Arbitrarily, choose the first prop of the first object
        const propName = Object.keys(values[0]).shift();
        const leafValues = values.map(v => v[propName]);
        return getComponentFromValues(`${name}.${propName}`, leafValues, types);
    }
    return <types.string source={name} />;
};

export default getComponentFromValues;
