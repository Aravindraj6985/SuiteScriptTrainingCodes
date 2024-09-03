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

            let new_sales_rep=-5;
            let cust=record.load({
                type:record.Type.CUSTOMER,
                id: 439
            })

             //let sales_rep=cust.getText({
             //    fieldId: 'salesrep'
             //})

             //if(sales_rep==null)
             //{
           
                cust.setValue({
                    fieldId: 'salesrep',
                    value: new_sales_rep,
                })

                log.debug({
                    title: 'Sales Rep Added to Customer',
                    details: 'Sales Rep ID: '+new_sales_rep
                });
             //}
             //else

             //log.debug({
               //  title: 'Sales Rep Already Exist',
                 //details: 'Sales Rep: '+sales_rep
             //});
             cust.save();

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
