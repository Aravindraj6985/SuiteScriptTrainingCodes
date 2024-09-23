/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {
            try
            {
                let result = createOpenSalesOrderSearch(requestParams);
                return(result);
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in execution',
                    details: e.message
                });
            }
        }

        function createOpenSalesOrderSearch(requestParams)
        {
            try
            {
                let customerId = requestParams.id;
                try
                {
                    let customerLoad = record.load({
                        type: record.Type.CUSTOMER,
                        id: customerId
                    });

                    //let customerName = customerLoad.getText('entity');
                    if(customerLoad)
                    {
                        let salesOrderSearch = search.create({
                            type: record.Type.SALES_ORDER,
                            filters: [['mainline', 'is', 'T'], 'and', 
                                        ['status', 'noneof',['SalesOrd:C','SalesOrd:G', 'SalesOrd:H']], 'and', 
                                        ['entity', 'is', customerId]],
                            columns: ['trandate', 'total', 'entity', 'status']
                            });

                        let searchResult = [];
                        salesOrderSearch.run().each(function(result){
                            let id = result.id;
                            let date = result.getValue('trandate');
                            let amount = result.getValue('total');
                            let status = result.getValue('status');
                            let customerName = result.getText('entity');
                            searchResult.push({id: id, customer: customerName, datecreated: date, orderAmount: amount, orderStatus: status});
                            return true; 
                        })
            
                        if (searchResult.length === 0) 
                        {
                            return 'No Open Sales Order......';
                        }
                        else
                        {
                            return {customerId: searchResult};
                        }     
                    }  
                }
                catch(e)
                {
                    return('Invalid Customer!!!');
                }
                   
            }    
            catch(e)
            {
                log.debug({
                    title: 'Error in Searching Open Sales Order',
                    details: e.message
                });
            }
        }
        

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {

        }

        return {get, put, post, delete: doDelete}

    });
