/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {

            try
            {
                loadSearch();
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Execution',
                    details: e.message
                });
            }

        }

        function loadSearch()
        {
            let salesOrderSearch = search.load({
                id: 'customsearch_jj_so_search'
            });
            salesOrderSearch.run().each(function(result) {
                var id = result.id;
                log.debug('Id: '+id );

                let cRec = record.submitFields({
                    type: record.Type.SALES_ORDER,
                    id: id,
                    values: {memo: 'Auto Update'},
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields : true
                    }                
                });

                log.debug('Memo field Updated');
                return true;
            });
        }

        return {execute}

    });
