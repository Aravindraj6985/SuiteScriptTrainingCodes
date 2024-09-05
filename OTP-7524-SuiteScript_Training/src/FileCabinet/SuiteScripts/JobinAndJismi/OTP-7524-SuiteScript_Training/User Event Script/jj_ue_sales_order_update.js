/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

            try{

                if(scriptContext.type==scriptContext.UserEventType.EDIT)
                    {
                        let so_id=scriptContext.newRecord.id;
                        let location=1;
                        let memo='SO Updated';
                        let so_update=record.submitFields({
                            type: record.Type.SALES_ORDER,
                            id: so_id,
                            values: {
                                memo: memo,
                                location : location
                            } 
                        })
    
                        log.debug({
                            title: 'Sales Order Location & Memo fields updated ',
                            details: 'Sales Order ID: '+so_id+'  Location ID: '+location+'  Memo: '+memo
                        })
                    }
                }    
                catch(e){
                    log.error({
                        title: 'Error Updating Sales Order',
                        details: e.message
                    })
                }

        }   

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
