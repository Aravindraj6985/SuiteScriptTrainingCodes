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
           "use strict";
            try{
                let credit_memo_search=search.create({
                    type: search.Type.CREDIT_MEMO,
                    filters:[['mainline', 'is', 'T'], 'and',['entity', 'is',1140]],
                    columns:['tranid','trandate','total','status','entity'],
                    title: 'Credit Memo Search JJ' ,
                    id: '_jj_credit_memo_search'
                })

                let new_search=credit_memo_search.run().getRange({
                    start: 0,
                    end: 1000
                })
                creditmemosearchresult(new_search); 

            }
            catch(e){
                log.debug({
                    title: 'Error in Executing Seacrh',
                    details: e.message
                })
            }
            
            function creditmemosearchresult(result)
            {
                if(result.length==0)
                    {
                        log.debug({
                            title: 'Results Not Available',
                            details: 'Number of result: '+result.length
                        })
                    }
    
                    else{
                        result.forEach(function(result){
                            let doc_num=result.getValue({name:'tranid'})
                            let trans_date=result.getValue({name:'trandate'})
                            let cust_name=result.getText({name:'entity'})
                            let status=result.getValue({name:'status'})
                            let amount=result.getValue({name:'total'})
                            log.debug({
                                title: 'Credit Memo Search Result',
                                details: `Customer Name: ${cust_name}, Trannsaction Date: ${trans_date}, Document Number: ${doc_num},  Status: ${status},  Amount: ${amount}`
                            })
                        })
                    }
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
