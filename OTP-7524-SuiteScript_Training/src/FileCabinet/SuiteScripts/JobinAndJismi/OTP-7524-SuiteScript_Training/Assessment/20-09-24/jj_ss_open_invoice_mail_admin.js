/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/search'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{search} search
 */
    (email, record, search) => {

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
                    columns: ['entity', 'tranid']
                });

                let body = 'Open Invoice \n \n';
                body += 'Customer Name  |   Invoice Number \n';
                body += '-----------------------------------------\n';

                invoiceSearch.run().each(function(result){
                    let id = result.id;
                    let customerName = result.getText('entity');
                    let docNumber = result.getValue('tranid');
                    body += `${customerName}    |   ${docNumber} \n`;
                    return true; 
                });
                mailToAdmin(body);
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Searching open Invoice',
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

                let recipient = '';
                adminSearch.run().each(function(result){
                    recipient = result.getValue('internalid');
                });

                email.send({
                    author: 849,
                    body: body,
                    recipients: recipient,
                    subject: 'Open Invoices Report'
                });
                
                log.debug({
                    title: 'Email Send',
                    details: 'Email Send to '+recipient+' to know the open invoices'
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
