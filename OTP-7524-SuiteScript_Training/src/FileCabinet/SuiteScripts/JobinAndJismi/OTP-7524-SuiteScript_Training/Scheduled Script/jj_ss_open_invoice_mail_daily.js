/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/runtime', 'N/search'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (email, record, runtime, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            try 
            {
                createOpenInvoiceSearch();
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Execution',
                    details: e.message
                });
            }

        }

        function createOpenInvoiceSearch()
        {
            try
            {
                let invoiceSearch = search.create({
                    type: search.Type.INVOICE,
                    filters: [['status', 'anyof', 'CustInvc:A'], 'and',['mainline','is','T']],
                    columns: ['entity', 'tranid', 'total']
                });
    
                let body = 'Open Invoice \n \n';
                body += 'Customer Name  |   Invoice Number  |   Amount \n';
                body += '----------------------------------------------\n';
    
                invoiceSearch.run().each(function(result) {
                    let customer = result.getText('entity');
                    let invNumber = result.getValue('tranid');
                    let amount = result.getValue('total');
                    body += `${customer}    |   ${invNumber}    |   ${amount} \n`;
                    return true; 
                });
                mailToAdmin(body);  
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Loading Search',
                    details: e.message
                });
            }            
        }

        function mailToAdmin(body)
        {
            try
            {
                let adminSearch = search.create({
                    type: search.Type.EMPLOYEE,
                    filters: ['role', 'anyof', 3],
                    columns: ['entityid', 'email', 'internalid']
                });

                let emailId = '';
                let author = '';
                adminSearch.run().each(function(result){
                    emailId = result.getValue('email');
                    author = result.getValue('internalid');
                    return true;
                });

                email.send({
                    author: author,
                    body: body,
                    recipients: emailId,
                    subject: 'Daily Open Invoice '
                });
                
                log.debug({
                    title: 'Email Send',
                    details: 'Email Send to '+emailId+' to know the open invoices'
                }); 
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Sending Mail',
                    details: e.message
                }); 
                log.debug(e.cause); 
            }
        }

        return {execute}

    });
