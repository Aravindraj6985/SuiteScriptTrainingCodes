/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/search', 'N/email'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{email} email
 * @param{runtime} runtime
 */
    (record, search, email, runtime) => {

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

            function loadSearch()
            {
                let salesRepArray = [];
                let salesOrderSearch = search.create({
                    type: search.Type.SALES_ORDER,
                    filters: [['mainline', 'is', 'T'], 'and',['trandate', 'within', 'this month']],
                    columns: [ search.createColumn({ name: 'salesrep', summary: search.Summary.GROUP})],
                    title: 'Sales order This Month Mail JJ',
                    id: 'customsearch_jj_so_this_month_mail',
                    isPublic: true
                });
                
                log.debug('Hello');
                salesOrderSearch.run().each(function(result){
                    let salesRepIds = result.getValue({name: 'salesrep', summary: search.Summary.GROUP});
                    if(salesRepIds)
                    {
                        log.debug('Hello');
                        salesRepArray.push(salesRepIds);
                        log.debug('Sales Reps: '+salesRepArray);
                    }
                });
                log.debug('Hello');
                //log.debug('Sales Reps: '+salesRepArray);
                salesRepCount = salesRepArray.length;
                log.debug('Sales Rep Number: '+salesRepCount);
                
                
                
                // salesOrderSearch.run().each(element => {
                //     let internalId = element.getValue('internalid');
                //     let DocumentNumber = element.getValue('tranid');
                //     let Date = element.getValue('trandate');
                //     let amount = element.getValue('total');
                //     let status = element.getValue('status');
                //     let customerName = element.getValue('entity');

                    
                // });


                
            }

        }

        return {execute}

    });
