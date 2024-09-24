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
                let result = salesOrderItemDetails(requestParams);
                return(result); 
            }
            catch(e)
            {
                return(e.message);
            }

        }

        function salesOrderItemDetails(requestParams)
        {
            let salesOrderId = requestParams.id;
            try
            {
                let salesOrderRecord = record.load({
                    type: record.Type.SALES_ORDER,
                    id: salesOrderId
                });

                let itemLineCount = salesOrderRecord.getLineCount({
                    sublistId: 'item'
                });

                let salesOrderItemDetails = [];
                for(let i=0; i<itemLineCount; i++)
                {
                    salesOrderItemDetails.push({id: salesOrderRecord.id,
                        itemName: salesOrderRecord.getSublistText({sublistId: 'item',fieldId: 'item',line: i}),
                        quantity: salesOrderRecord.getSublistValue({sublistId: 'item',fieldId: 'quantity',line: i}),
                        rate: salesOrderRecord.getSublistValue({sublistId: 'item',fieldId: 'rate',line: i}),
                        amount: salesOrderRecord.getSublistValue({sublistId: 'item',fieldId: 'amount',line: i}) 
                    });
                    
                }

                if(itemLineCount>1)
                {
                    salesOrderItemDetails.unshift({message: 'Sales Order Conatains more than 1 item'});
                    return(salesOrderItemDetails);
                }
                else
                {
                    return(salesOrderItemDetails);
                }
                
            }
            catch(e)
            {
                return('Invalid Sales Order ID!!!!');
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
