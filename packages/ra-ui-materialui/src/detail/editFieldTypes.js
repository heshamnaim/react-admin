import SimpleForm from '../form/SimpleForm';
import ArrayInput from '../input/ArrayInput';
import BooleanInput from '../input/BooleanInput';
import DateInput from '../input/DateInput';
import NumberInput from '../input/NumberInput';
import ReferenceInput from '../input/ReferenceInput';
import ReferenceArrayInput from '../input/ReferenceArrayInput';
import TextInput from '../input/TextInput';

export default {
    form: {
        component: SimpleForm,
        representation: (_, children) => `
<SimpleForm>
${children.map(child => `  ${child.getRepresentation()}`).join('\n')}
</SimpleForm>`,
    },
    array: { component: ArrayInput },
    boolean: {
        component: BooleanInput,
        representation: props => `<BooleanInput source="${props.source}" />`,
    },
    date: {
        component: DateInput,
        representation: props => `<DateInput source="${props.source}" />`,
    },
    email: {
        component: TextInput,
        representation: props => `<TextInput source="${props.source}" />`,
    },
    id: {
        component: TextInput,
        representation: props => `<TextInput source="${props.source}" />`,
    },
    number: {
        component: NumberInput,
        representation: props => `<NumberInput source="${props.source}" />`,
    },
    reference: {
        component: ReferenceInput,
        representation: props =>
            `<ReferenceInput source="${props.source}" reference="${
                props.reference
            }"><TextInput source="id" /></ReferenceInput>`,
    },
    referenceArray: {
        component: ReferenceArrayInput,
        representation: props =>
            `<ReferenceArrayInput source="${props.source}" reference="${
                props.reference
            }"><TextInput source="id" /></ReferenceArrayInput>`,
    },
    richText: false, // never display a rich text Input in a datagrid
    string: {
        component: TextInput,
        representation: props => `<TextInput source="${props.source}" />`,
    },
    url: {
        component: TextInput,
        representation: props => `<TextInput source="${props.source}" />`,
    },
};
