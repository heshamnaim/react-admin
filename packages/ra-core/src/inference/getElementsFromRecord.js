import inferElementFromValue from './inferElementFromValue';

/**
 * Get a list of React-admin field components from a records
 *
 * @example
 * const record = {
 *     "id": 1,
 *     "title": "Lorem Ipsum",
 *     "views": 254,
 *     "user_id": 123,
 * };
 * const types = {
 *     id: NumberField,
 *     string: TextField,
 *     number: NumberField,
 *     reference: ReferenceField
 * };
 * const types = getElementsFromRecord(record, types);
 * // [
 * //    <NumberField source="id" />,
 * //    <TextField source="title" />,
 * //    <NumberField source="views" />,
 * //    <ReferenceField source="user_id" reference="users"><NumberField source="id" /></ReferenceField>,
 * // ];
 */
export default (record, types) =>
    Object.keys(record)
        .reduce(
            (fields, fieldName) =>
                fields.concat(
                    inferElementFromValue(
                        fieldName,
                        record[fieldName],
                        types
                    ).getElement()
                ),
            []
        )
        .filter(x => x);
