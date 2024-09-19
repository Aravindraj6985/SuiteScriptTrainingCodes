/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
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

                log.debug(newObject);
                newObject.setValue({
                    fieldId: 'custrecord_jj_marital_status',
                    value: 1
                })

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
