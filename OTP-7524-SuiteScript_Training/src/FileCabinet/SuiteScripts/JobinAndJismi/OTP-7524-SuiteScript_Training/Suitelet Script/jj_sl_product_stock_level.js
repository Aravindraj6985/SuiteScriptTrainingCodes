/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try
            {
                log.debug({
                    title: 'Request',
                    details: scriptContext.request.method
                });
    
                if(scriptContext.request.method === 'GET')
                {
                    createProductDisplayForm();
                    log.debug({
                        title: 'Form Created',
                        details: 'Product Form created successfully'
                    });
                }
                else if(scriptContext.request.method === 'POST')
                {
                    //let  = 
                    log.debug({
                        title: '',
                        details: ': '
                    });
                }
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Executing',
                    details: e.stack
                });
            }

            function createProductDisplayForm()
            {
                try
                {
                    
                }
                catch(e)
                {
                    log.debug({
                        title: 'Error in Creating Form',
                        details: e.stack
                    });
                }
            }

        }

        return {onRequest}

    });
