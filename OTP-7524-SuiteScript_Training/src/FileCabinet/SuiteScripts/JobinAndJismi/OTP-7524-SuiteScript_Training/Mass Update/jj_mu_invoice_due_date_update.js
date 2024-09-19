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
                
                let invoiceRecord = record.load({
                    type: record.Type.INVOICE,
                    id: params.id
                });
    
                let dueDate = invoiceRecord.getValue({ fieldId: 'duedate' });
                let currentDate = new Date();
                let dueDateObj = new Date(dueDate);
                let diffTime = Math.abs(currentDate - dueDateObj);
                let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
                if (currentDate > dueDateObj && diffDays >= 5) 
                {
                    let newDueDate = new Date(currentDate);
                    newDueDate.setDate(newDueDate.getDate() + 15); 
                    invoiceRecord.setValue({
                        fieldId: 'duedate',
                        value: newDueDate
                    });
                    invoiceRecord.save();
                }
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
