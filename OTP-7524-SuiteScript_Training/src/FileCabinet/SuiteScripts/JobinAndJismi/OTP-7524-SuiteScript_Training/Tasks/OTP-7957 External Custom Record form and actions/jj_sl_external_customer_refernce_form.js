/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/email', 'N/record', 'N/search', 'N/ui/serverWidget', 'N/url'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{search} search
 */
    (email, record, search, serverWidget, url) => {
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
                    createCustomerRefenceForm(scriptContext);
                }
                else if(scriptContext.request.method === 'POST')
                {
                    createCustomCustomerRefenceRecord(scriptContext);
                }
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Execution',
                    details: e.message
                });
            }

        }

        function createCustomerRefenceForm(scriptContext)
        {
            try
            {
                let form = serverWidget.createForm({
                    title: 'Customer Reference Form'
                });

                form.addFieldGroup({
                    id: 'custpage_jj_primaryField',
                    label: 'Primay Information'
                });

                form.addField({
                    id: 'custpage_jj_cust_name',
                    label: 'Customer Name',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_jj_primaryField'
                }).isMandatory = true;

                form.addField({
                    id: 'custpage_jj_cust_email',
                    label: 'Customer Email',
                    type: serverWidget.FieldType.EMAIL,
                    container: 'custpage_jj_primaryField'
                }).isMandatory = true;

                form.addField({
                    id: 'custpage_jj_cust_subject',
                    label: 'Subject',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_jj_primaryField'
                });

                form.addField({
                    id: 'custpage_jj_cust_message',
                    label: 'Message',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_jj_primaryField'
                });

                form.addResetButton({
                    label: 'Reset'
                });

                form.addSubmitButton({
                    label: 'Save'
                });

                scriptContext.response.writePage(form);
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Creating Form',
                    details: e.message
                });
            }
        }

        function createCustomCustomerRefenceRecord(scriptContext)
        {
            try
            {
                let request = scriptContext.request;
                let cName = request.parameters.custpage_jj_cust_name; 
                let cEmail = request.parameters.custpage_jj_cust_email; 
                let cSubject = request.parameters.custpage_jj_cust_subject; 
                let cMessage = request.parameters.custpage_jj_cust_message;
                
                let recId;
                let custId;
                let salesRep;
                
                let customSearch = search.create({
                    type: 'customrecord_jj_customer_reference_recor',
                    filters: ['custrecord_jj_customer_email', 'is', cEmail],
                    columns: ['internalid', 'name']
                });

                let searchResult = customSearch.run().getRange({
                    start: 0,
                    end: 1
                });

                log.debug('Search Length: '+searchResult.length);

                if(searchResult.length > 0)
                {
                    customSearch.run().each(function(result){
                        recId = result.id;
                    });
                    log.debug('Record Already Exists. ID: '+recId);
                }
                else
                {
                    let customerSearch = search.create({
                        type: search.Type.CUSTOMER,
                        filters: ['email', 'is', cEmail],
                        columns: ['internalid', 'entityid', 'salesrep']
                    });

                    let searchResult = customerSearch.run().getRange({
                        start: 0,
                        end: 1
                    });
    
                    log.debug('Search Length: '+searchResult.length);
    
                    if(searchResult.length > 0)
                    {
                        customerSearch.run().each(function(result){
                            custId = result.id;
                            salesRep = result.getValue('salesrep');
                        });

                        log.debug('Customer ID: '+custId+' Sales Rep ID: '+salesRep);

                        let urlLink = url.resolveRecord({
                            recordId: custId,
                            recordType: 'customer'
                        });

                        log.debug('URL: '+urlLink);

                        let custRecId = createRecord(cName, cEmail, cSubject, cMessage);
                        log.debug('Custom Record Created. ID: '+custRecId);

                        record.submitFields({
                            type: 'customrecord_jj_customer_reference_recor',
                            id: custRecId,
                            values: {'custrecord_jj_customer_reference':urlLink}
                        });
                        log.debug('URL Saved to Record. ID :'+custRecId);

                        sentMail()
                    }
                    else
                    {
                        let custRecId = createRecord(cName, cEmail, cSubject, cMessage);
                        log.debug('Custom Record Created. ID: '+custRecId);
                    }
                }
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Creating Record',
                    details: e.message
                });
                log.debug(e.stack);
                log.debug(e.cause);
            }
        }

        function createRecord(cName, cEmail, cSubject, cMessage)
        {
            try
            {
                let custRecord = record.create({
                    type: 'customrecord_jj_customer_reference_recor'
                });
                
                custRecord.setValue({fieldId: 'name', value: cName});
                custRecord.setValue({fieldId: 'custrecord_jj_customer_email', value: cEmail});
                custRecord.setValue({fieldId: 'custrecord_jj_subject', value: cSubject});
                custRecord.setValue({fieldId: 'custrecord_jj_message', value: cMessage});

                let custRecId = custRecord.save();
                return custRecId;

            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Custom Record Creating',
                    details: e.message
                });
            }
        }

        return {onRequest}

    });
