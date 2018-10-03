import ArrayField from './ArrayField';
import BooleanField from './BooleanField';
import DateField from './DateField';
import EmailField from './EmailField';
import NumberField from './NumberField';
import ReferenceField from './ReferenceField';
import ReferenceArrayField from './ReferenceArrayField';
import TextField from './TextField';
import UrlField from './UrlField';

export default {
    array: ArrayField,
    boolean: BooleanField,
    date: DateField,
    email: EmailField,
    id: TextField,
    number: NumberField,
    reference: ReferenceField,
    referenceArray: ReferenceArrayField,
    richText: false, // never display a rich text field in a datagrid
    string: TextField,
    url: UrlField,
};
