/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        const each = (params) => {
            try
            {
                log.debug('params', JSON.stringify(params));
                let newObject = record.load({
                    type: params.type,
                    id: params.id
                });

                

                let lineCount = newObject.getLineCount({
                    sublistId: 'item'
                });

                for(let i=0; i<lineCount; i++)
                {
                    newObject.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: i,
                        value: 10
                    });
                }
                let id = newObject.save();
                log.debug('Saved Recod ID: '+id);
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Execution',
                    details: e.message
                });
            }

        }

        return {each}

    });
