/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/email', 'N/runtime'],
    /**
 * @param{action} action
 * @param{search} search
 */
    (record, search, email, runtime) => {
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
            try
            {
                if(scriptContext.type === scriptContext.UserEventType.CREATE)
                {
                    let salesOrder = scriptContext.newRecord;
                    let customer = salesOrder.getValue('entity');
                    let salesRep = salesOrder.getValue('salesrep');
                    log.debug({
                        title: 'customer & Rep',
                        details: customer, salesRep
                    });

                    searchSalesOrder(customer,  salesRep);
                }
            }
            catch(e){
                log.debug({
                    title: 'Error in Sending Email',
                    details: e.message
                });
            }

        }

        function searchSalesOrder(entity, rep)
        {
            let salesOrderSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters: [['status','anyof',['SalesOrd:A', 'SalesOrd:B', 'SalesOrd:D', 'SalesOrd:E', 'SalesOrd:F']],
                         'and', ['mainline', 'is', 'T'],
                         'and',  ['entity', 'is', entity]],
                columns: ['internalid', 'tranid', 'trandate', 'total', 'status', 'entity']
            });
            
            let searchResults=salesOrderSearch.run().getRange({
                start: 0,
                end: 100
            });
    
            let numOfSalesOrder = searchResults.length;
            log.debug({
                title: 'Pending Sales Order Number for Customer: '+entity,
                details: 'Number of result: '+numOfSalesOrder
            });

            let salesRepRecord = record.load({
                type: record.Type.EMPLOYEE,
                id: rep
            });

            log.debug({
                title: 'Name of Rep: ',
                details: 'Name: '+rep
            });

            
            let repMailID = salesRepRecord.getValue({
                fieldId: 'email'
            });

            log.debug({
                title: 'Mail ID',
                details: 'Sales Rep Mail ID: '+repMailID
            });

            if(numOfSalesOrder > 5)
            {
                email.send({
                    author: runtime.getCurrentUser().id,
                    body: 'A sales order has been created for a customer with more than 5 Open Sales Orders. \n \n' 
                           + 'Number of Open Sales Order: '+numOfSalesOrder,
                    recipients: repMailID,
                    subject: 'Sales Order Created for Customer with open Sales Order: '
                });

                log.debug({
                    title: 'Email Sent to Sales Rep',
                    details: 'Email is sent to the Sales Rep'
                }); 
            }
            
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
