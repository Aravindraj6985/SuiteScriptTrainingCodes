/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
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

        /**p
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
                searchCustomer();
            }
            catch(e){
                log.debug({
                    title: 'Error in Sending Email',
                    details: e.message
                });
            }

            function searchCustomer()
            {
                if(scriptContext.type===scriptContext.UserEventType.CREATE)
                {
                    let salesOrder=scriptContext.newRecord;
                    let customername=salesOrder.getValue('entity');
                    let salesRep=salesOrder.getValue('salesrep');

                    let invoiceSearch=search.create({
                        type: search.Type.INVOICE,
                        filters: [['status','is','CustInvc:A'], 'and', ['mainline', 'is', 'T'], 'and',  ['entity', 'is', customername]],
                        columns: ['internalid', 'tranid', 'trandate', 'total', 'status', 'entity']
                    });
                    
                    let searchResults=invoiceSearch.run().getRange({
                        start: 0,
                        end: 100
                    });

                    if(searchResults.length==0)
                        {
                            log.debug({
                                title: 'No Pending Invoice for Customer',
                                details: 'Number of result: '+searchResults.length
                            });
                        }
        
                        else{
                            searchResults.forEach(function(result){
                                let internalId=result.getValue({name:'internalid'});
                                let doc_num=result.getValue({name:'tranid'});
                                let trans_date=result.getValue({name:'trandate'});
                                let cust_name=result.getText({name:'entity'});
                                let status=result.getValue({name:'status'});
                                let amount=result.getValue({name:'total'});
                                log.debug({
                                    title: 'Credit Memo Search Result',
                                    details: `Internal id: ${internalId} Customer Name: ${cust_name}, Trannsaction Date: ${trans_date}, Document Number: ${doc_num},  Status: ${status},  Amount: ${amount}`
                                });
                                loadEmployee(salesRep, salesOrder);
                            })
                        }
                }

                function loadEmployee(salesRepNew, order)
                {
                    let salesRepRecord = record.load({
                        type: record.Type.EMPLOYEE,
                        id: salesRepNew
                    });

                    let salesManager=salesRepRecord.getValue('supervisor');
                    
                    if(salesManager)
                    {
                        let salesManagerRecord=record.load({
                            type: record.Type.EMPLOYEE,
                            id: salesManager
                        });

                        log.debug({
                            title: 'Sales Manager Available',
                            details: 'Sales Manager: '+salesManager
                        });

                        let managerEmail=salesManagerRecord.getValue('email');

                        if(managerEmail)
                        {
                            email.send({
                                author: runtime.getCurrentUser().id,
                                body: 'A sales order has been created for a customer with overdue invoices. Sales Order ID: ' + order.id,
                                recipients: managerEmail,
                                subject: 'Sales Order for Customer with Overdue is Created by: '+salesRepNew
                            });

                            log.debug({
                                title: 'Email Sent to Manager',
                                details: 'Email is sent to the Manager'
                            }); 

                        }
                        else
                        {
                            log.debug({
                                title: 'Email Not Available',
                                details: 'Email ID is not entered in the Manager Record'
                            }); 
                        }

                    }

                    else
                    {
                        log.debug({
                            title: 'No Sales Manager Available',
                            details: 'Sales Manager is not Available for this Employee'
                        });
                    }
                }
            }
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
