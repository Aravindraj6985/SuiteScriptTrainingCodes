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
                createCustomRecord();
                return true;
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Execution',
                    details: e.message
                });
            }

        }

        function createCustomRecord()
        {
            let customRecord = record.create({
                type: 'customrecord_jj_new_record',
                isDynamic: true
            });

            customRecord.setValue({
                fieldId: 'name',
                value: 'Test Name'
            });

            customRecord.setValue({
                fieldId: 'custrecord_jj_test_field',
                value: 'Test Field'
            });

            let recordId = customRecord.save();
            log.debug({
                title: 'Record Created',
                details: 'Record ID: '+recordId
            });

        }

        return {onAction};
    });
