/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search'],
    /**
 * @param{search} search
 */
    (search) => {
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

            try{
                if (scriptContext.type === scriptContext.UserEventType.CREATE) {
                    let vendor_search = search.create({
                        type: search.Type.VENDOR,
                        filters: [],
                        columns: [ 'entityid', 'subsidiary']
                    });
    
                    let results = vendor_search.run().getRange({
                        start: 0,
                        end: 1000
                    });
    
                    results.forEach(function(result) {
                        let vendor_name = result.getValue({ name: 'entityid' });
                        let subsidiary = result.getText({ name: 'subsidiary' });
    
                        log.debug('Vendor: ' + vendor_name + ', Subsidiary: ' + subsidiary);
                    });
            }
            }
            catch(e){
                log.debug({
                    title: 'Error in Searching',
                    details: e.message
                })
            }


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

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
