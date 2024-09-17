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
                createSalesOrderSearch(scriptContext);
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Execution',
                    details: e.message
                });
            }
        }

        function createSalesOrderSearch(scriptContext)
        {
            try
            {
                let salesOrderSearch = search.create({
                    type: search.Type.SALES_ORDER,
                    filters: [['mainline' ,'is', 'F'],'and',['status','anyof', ['SalesOrd:A', 'SalesOrd:B', 'SalesOrd:D', 'SalesOrd:E', 'SalesOrd:F']],
                             'and', ['trandate', 'before', 'daysago4'],'and', ['item','anyof', 229]],
                    columns: ['entity', 'total', 'trandate', 'tranid']

                });
                
                salesOrderSearch.run().each(function(result){
                    let custName = result.getValue('entity');
                    let date = result.getValue('trandate');
                    let docNumber = result.getValue('tranid');
                    log.debug('Customer ID: '+custName+ 'Date: '+date+' Document Number: '+docNumber); 
                    let id = result.id;

                    let salesOrderRecord = record.load({
                        type: record.Type.SALES_ORDER,
                        id: id
                    });

                    let lineCount = salesOrderRecord.getLineCount({
                        sublistId: 'item'
                    });

                    for (let i=0; i<lineCount; i++)
                    {
                        salesOrderRecord.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'isclosed',
                            line: i,
                            value: true
                        })
                    }
                    salesOrderRecord.save();
                    return true;
                });
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Sarching Invoice',
                    details: e.stack
                });
                log.debug(e.message);
                log.debug(e.cause);
            }
        }
        return {execute}

    });
