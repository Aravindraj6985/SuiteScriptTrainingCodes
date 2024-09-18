/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/runtime', 'N/search', 'N/render'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (email, record, runtime, search, render) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            try
            {
                createSalesOrderSearch();
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Executing',
                    details: e.message
                });
            }

        }

        function createSalesOrderSearch()
        {
            try
            {
                let salesOrderSearch = search.create({
                    type: search.Type.SALES_ORDER,
                    filters: [['mainline', 'is', 'T'], 'and', ['trandate', 'on', 'today']],
                    columns: ['entity', 'tranid', 'total']
                });

                salesOrderSearch.run().each(function(result){
                    let soId = Number(result.id);
                    let customerName = result.getValue('entity');
                    let docNumber = result.getValue('tranid');
                    let amount = result.getValue('total');
                    log.debug(`Internal ID: ${soId} Customer ID: ${customerName} Document No: ${docNumber}`);

                    let custRec = record.load({
                        type: record.Type.CUSTOMER,
                        id: customerName
                    });

                    let custEmail = custRec.getValue('email');

                    let pdfFile = render.transaction({
                        entityId: soId,
                        printMode: render.PrintMode.PDF
                    });

                    email.send({
                        author: -5,
                        body: 'A sales order with Document No: '+docNumber+' is generated for amount: '+amount+'. Please find the attached document.',
                        recipients: custEmail,
                        subject: 'Sales Orders Generated Today',
                        attachments: [pdfFile]
                    });
                    log.debug('Email send to '+custEmail);
                    return true;
                });
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Creating Search',
                    details: e.stack
                });
                log.debug(e.message);
                log.debug(e.cause);
            }
        }

        return {execute}

    });
