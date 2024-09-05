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
            try {
                if (scriptContext.type === scriptContext.UserEventType.VIEW) {
                    let savedSearchId = 31;
                    displaySavedSearchDetails(savedSearchId);
                }
            } catch (e) {
                log.error({
                    title: 'Error Loading Saved Search',
                    details: e.message
                });
            }
        };
    
        function displaySavedSearchDetails(searchId) {
            try {
                let savedSearch = search.load({
                    id: searchId
                });
    
                let searchResult = savedSearch.run().getRange({
                    start: 0,
                    end: 100
                });
    
                if (searchResult.length > 0) {
                    searchResult.forEach(result => {
                        let resultDetails = result.columns.map(column => {
                            return {
                                name: column.name,
                                value: result.getValue(column)
                            };
                        });
                        log.debug({
                            title: 'Search Result',
                            details: JSON.stringify(resultDetails)
                        });
                    });
                } else {
                    log.debug({
                        title: 'Search Results',
                        details: 'No results found.'
                    });
                }
            } catch (e) {
                log.error({
                    title: 'Error Displaying Search Results',
                    details: e.message
                });
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
