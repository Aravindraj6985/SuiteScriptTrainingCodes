/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */
        const onAction = (scriptContext) => {
            try
            {
                let cRec = scriptContext.newRecord;
                let numberField = cRec.getValue({
                    fieldId: 'custbody_jj_so_number'
                });
                
                let resultField = '';
                if (numberField >= 100)
                {
                    resultField = 'Result: Passed';
                }

                else 
                {
                    resultField = 'Result: Failed';
                }

                cRec.setValue({
                    fieldId: 'custbody_jj_so_result',
                    value: resultField
                });
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Execution',
                    details: e.message
                });
            }

        }

        return {onAction};
    });
