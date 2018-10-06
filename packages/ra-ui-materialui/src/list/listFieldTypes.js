import React from 'react';
import Datagrid from './Datagrid';
import ArrayField from '../field/ArrayField';
import BooleanField from '../field/BooleanField';
import DateField from '../field/DateField';
import EmailField from '../field/EmailField';
import NumberField from '../field/NumberField';
import ReferenceField from '../field/ReferenceField';
import ReferenceArrayField from '../field/ReferenceArrayField';
import TextField from '../field/TextField';
import UrlField from '../field/UrlField';

export default {
    table: {
        component: props => <Datagrid rowClick="edit" {...props} />,
        representation: (_, children) => `
<Datagrid rowClick="edit">
${children.map(child => `  ${child.getRepresentation()}`).join('\n')}
</Datagrid>`,
    },
    array: { component: ArrayField },
    boolean: {
        component: BooleanField,
        representation: props => `<BooleanField source="${props.source}" />`,
    },
    date: {
        component: DateField,
        representation: props => `<DateField source="${props.source}" />`,
    },
    email: {
        component: EmailField,
        representation: props => `<EmailField source="${props.source}" />`,
    },
    id: {
        component: TextField,
        representation: props => `<TextField source="${props.source}" />`,
    },
    number: {
        component: NumberField,
        representation: props => `<NumberField source="${props.source}" />`,
    },
    reference: {
        component: ReferenceField,
        representation: props =>
            `<ReferenceField source="${props.source}" reference="${
                props.reference
            }"><TextField source="id" /></ReferenceField>`,
    },
    referenceArray: {
        component: ReferenceArrayField,
        representation: props =>
            `<ReferenceArrayField source="${props.source}" reference="${
                props.reference
            }"><TextField source="id" /></ReferenceArrayField>`,
    },
    richText: false, // never display a rich text field in a datagrid
    string: {
        component: TextField,
        representation: props => `<TextField source="${props.source}" />`,
    },
    url: {
        component: UrlField,
        representation: props => `<UrlField source="${props.source}" />`,
    },
};
