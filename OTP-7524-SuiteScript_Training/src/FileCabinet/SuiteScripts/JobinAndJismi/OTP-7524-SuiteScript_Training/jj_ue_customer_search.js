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
                let customer_search=search.create({
                    type: search.Type.CUSTOMER,
                    filters: ['datecreated','within','thismonth'],
                    columns: ['entityid', 'subsidiary', 'salesrep', 'email', 'datecreated'],
                    title: 'Customer Search JJ',
                    id: '_jj_customer_search'
                })

                let new_search=customer_search.run().getRange({
                    start: 0,
                    end: 1000
                });

                    new_search.forEach(function(result){
                    let customer_name=result.getValue({name:'entityid'})
                    let subsidiary=result.getText({name:'subsidiary'})
                    let salesrep=result.getText({name:'salesrep'})
                    let email=result.getValue({name:'email'})
                    let datecreated=result.getValue({name:'datecreated'})
                    log.debug({
                        title: 'Customer Search',
                        details: `Customer Name: ${customer_name}, Subsidiary: ${subsidiary}, Sales Rep: ${salesrep}, Email: ${email}, Date Created: ${datecreated}`
                    })
                })
                new_search.save

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
