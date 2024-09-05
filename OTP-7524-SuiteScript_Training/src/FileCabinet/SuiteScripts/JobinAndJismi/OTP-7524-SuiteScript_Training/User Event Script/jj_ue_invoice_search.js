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
                let invoice_search=search.create({
                    type: search.Type.INVOICE,
                    filters: ['status','is','CustInvc:A'],
                    columns: ['tranid','trandate','entity','status','email','total'],
                    title: 'Invoice Search JJ' ,
                    id: '_jj_invoice_search'
                })

                let new_search=invoice_search.run().getRange({
                    start: 0,
                    end: 100
                })

                if(new_search.length==0)
                {
                    log.debug({
                        title: 'No Result',
                        details: 'Number of result: '+new_search.length
                    })
                }

                else{
                    new_search.forEach(function(result){
                        let doc_num=result.getValue({name:'tranid'})
                        let trans_date=result.getValue({name:'trandate'})
                        let cust_name=result.getText({name:'entity'})
                        let status=result.getValue({name:'status'})
                        let email=result.getValue({name:'email'})
                        let amount=result.getValue({name:'total'})
                        log.debug({
                            title: 'Invoice Search Result',
                            details: `Customer Name: ${cust_name}, Trannsaction Date: ${trans_date}, Document Number: ${doc_num}, Invoice Status: ${status}, Email: ${email}, Amount: ${amount}`
                        })
                    })
                }
              
                
                
            }
            catch(e){
                log.debug({
                    title: 'Error in Executing Search',
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
