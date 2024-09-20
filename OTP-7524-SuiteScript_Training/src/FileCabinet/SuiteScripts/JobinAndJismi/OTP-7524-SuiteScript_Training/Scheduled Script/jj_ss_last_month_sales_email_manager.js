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
                findSalesReps();
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Execution',
                    details: e.message
                });
            }

            function findSalesReps()
            {
                try
                {
                    let salesRepSearch = search.create({
                        type: search.Type.EMPLOYEE,
                        filters: [['salesrep', 'is', 'T'], 'and', ['isinactive', 'is', 'F']] ,
                        columns: ['internalid']
                    });
    
                    salesRepSearch.run().each(function(result){
                        let salesRepID = result.getValue('internalid');

                        let salesRepRec = record.load({
                            type: record.Type.EMPLOYEE,
                            id: salesRepID
                        });

                        let supervisorID = salesRepRec.getValue('supervisor');
                        
                        if(supervisorID)
                        {
                            log.debug('Sales Rep: '+salesRepID+' Supervisor: '+supervisorID);
                            salesOrderSearch(salesRepID, supervisorID);
                        }
                        else
                        {
                            log.debug('Supervisor not available');
                        }
                        return true;
                    });
                }
                catch(e)
                {
                    log.debug({
                        title: 'Error in Finding Sales Reps',
                        details: e.message
                    }); 
                }
            }

            function salesOrderSearch(salesrep, supervisor)
            {
                try
                {
                    let salesOrderSearch = search.create({
                        type: search.Type.SALES_ORDER,
                        filters: [['mainline', 'is', 'T'], 'and', ['salesrep', 'is', salesrep], 'and',['trandate', 'within', 'thismonth']],
                        columns: ['entity', 'trandate', 'tranid', 'total', 'status']
                    });

                    salesOrderSearch.run().each(function(result){
                        let docId = result.id;
                        let customerName = result.getValue('entity');
                        let date = result.getValue('trandate');
                        let soNumber = result.getValue('tranid');
                        let amount = result.getValue('total');
                        let status = result.getValue('status');

                    log.debug('Entity: '+customerName+' Amount: '+amount+' Status: '+status+' ID: '+docId);
                    email.send({
                        author: salesrep,
                        body: `Monthly sales order report of ${salesrep} \n
                                Customer Name: ${customerName} \n
                                Date: ${date} Document No: ${soNumber} \n
                                Amount: ${amount} Status: ${status}`,
                        recipients: supervisor,
                        subject: `ID:${salesrep} (salesrep) monthly sales report` 
                    });
                    log.debug('email send to supervisor');
                    return true;  
                    });
                }
                catch(e)
                {
                    log.debug({
                        title: 'Error in searching Sales order & mailinglog',
                        details: e.message
                    });   
                }
            }

        }

        return {execute}

    });
