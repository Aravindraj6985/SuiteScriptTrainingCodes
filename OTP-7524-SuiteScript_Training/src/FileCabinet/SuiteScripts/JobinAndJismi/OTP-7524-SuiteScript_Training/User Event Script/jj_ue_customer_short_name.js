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
            try
            {
                customerSearch();
            }
            catch(e){
                log.debug({
                    title: 'Error in creating shortname',
                    details: e.message
                });
            }

            function customerSearch()
            {
                let customerSearch=search.create({
                    type: search.Type.CUSTOMER,
                    columns: ['companyname','datecreated','internalid']
                });

                let new_search=customerSearch.run().getRange({
                    start: 0,
                    end: 1000
                });

                new_search.forEach(function(result){
                    let customerName=result.getValue({name:'companyname'});
                    let dateCreated=result.getValue({name:'datecreated'});
                    let internalId=result.getValue({name:'internalid'});
                    log.debug({
                        title: 'Customer Search',
                        details: `Customer Name: ${customerName}, Date Created: ${dateCreated}, Internal ID: ${internalId}`
                    });

                let shortName=getshortName(customerName, dateCreated);
                record.submitFields({
                    type: record.Type.CUSTOMER,
                    id: internalId,
                    values: {custentity_jj_cust_short_name: shortName} 
                });

                log.debug({
                    title: 'Short Name',
                    details: 'Entered the Short Name field with: '+shortName
                });
                })
            }

            function getshortName(name, date)
            {
                let namePart = name.slice(0,2);
                let fullDate = date.split(' ');
                let newDate = fullDate[0].split('/');
                let month = newDate[1];
                let shortName = `${namePart}:0${month}`;
                return shortName;
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
