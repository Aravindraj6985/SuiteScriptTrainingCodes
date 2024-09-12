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
            try {
                log.debug({
                    title: 'Request',
                    details: scriptContext.request.method
                });

                if (scriptContext.request.method === 'GET') {
                    createCustomDetailsForm();
                    log.debug({
                        title: 'Custom Page',
                        details: 'Custom Details Entered'
                    });
                }
                else if (scriptContext.request.method === 'POST') {
                    let customRecordId = createCustomRecord()
                    log.debug({
                        title: 'Custom Record ID Fetched',
                        details: 'Custom Record ID: ' + customRecordId
                    });
                }
            }
            catch (e) {
                log.debug({
                    title: 'Error in Execution',
                    details: e.message
                });
            }

            function createCustomDetailsForm() {
                try {
                    let form = serverWidget.createForm({
                        title: 'Information Entry Form'
                    });

                    form.addFieldGroup({
                        id: 'cust_jj_fieldgroup',
                        label: 'Primary Information'
                    });

                    form.addField({
                        id: 'cust_jj_firstname',
                        label: 'First Name',
                        type: serverWidget.FieldType.TEXT,
                        container: 'cust_jj_fieldgroup'
                    }).isMandatory = true;

                    form.addField({
                        id: 'cust_jj_lastname',
                        label: 'Last Name',
                        type: serverWidget.FieldType.TEXT,
                        container: 'cust_jj_fieldgroup'
                    }).isMandatory = true;

                    form.addField({
                        id: 'cust_jj_email',
                        label: 'Email',
                        type: serverWidget.FieldType.EMAIL,
                        container: 'cust_jj_fieldgroup'
                    });

                    form.addField({
                        id: 'cust_jj_phonenumber',
                        label: 'Phone Number',
                        type: serverWidget.FieldType.PHONE,
                        container: 'cust_jj_fieldgroup'
                    });

                    form.addField({
                        id: 'cust_jj_dob',
                        label: 'Date of Birth',
                        type: serverWidget.FieldType.TEXT,
                        container: 'cust_jj_fieldgroup'
                    });

                    // form.addField({
                    //     id: 'cust_jj_manager',
                    //     label: 'Account Manager',
                    //     type: serverWidget.FieldType.TEXT,
                    //     container: 'cust_jj_fieldgroup'
                    // });

                    form.addSubmitButton({
                        label: 'Submit'
                    });

                    form.addResetButton({
                        label: 'Reset'
                    });

                    scriptContext.response.writePage(form);
                }
                catch (e) {
                    log.debug({
                        title: 'Error in Creating Form',
                        details: e.stack
                    });
                }

            }

            function createCustomRecord() {
                try {
                    let request = scriptContext.request;
                    let fName = request.parameters.cust_jj_firstname;
                    let lName = request.parameters.cust_jj_lastname;
                    let email = request.parameters.cust_jj_email;
                    let phone = request.parameters.cust_jj_phonenumber;
                    let dob = request.parameters.cust_jj_dob;
                    //let manager = request.parameters.cust_jj_manager;

                    let customRecord = record.create({
                        type: 'customrecord_jj_custom_record',
                        isDynamic: true
                    })

                    customRecord.setValue({ fieldId: 'name', value: fName });
                    customRecord.setValue({ fieldId: 'custrecord1', value: lName });
                    customRecord.setValue({ fieldId: 'custrecord2', value: email });
                    customRecord.setValue({ fieldId: 'custrecord3', value: phone });
                    customRecord.setValue({ fieldId: 'custrecord4', value: dob });
                    //customRecord.setValue({ fieldId: 'custrecord5', value: manager });

                    let recordId = customRecord.save();
                    log.debug({
                        title: 'Custom Record Created',
                        details: 'Custom Record: ' + recordId
                    });

                    emailIdSearch(email, recordId);
                    return recordId;
                }
                catch (e) {
                    log.debug({
                        title: 'Error in Creating Record',
                        details: e.stack
                    });
                }
            }

            function emailIdSearch(mail, record) {
                try {
                    
                    let emailSearch = search.create({
                        type: search.Type.CUSTOMER,
                        filters: ['email', 'is', mail],
                        columns: ['entityid', 'email', 'salesrep'],
                        title: 'New Search Customer',
                        id: 'customsearch_jj_customer_search_cust',
                        isPublic: true
                    });

                    let salesRepField = null;
                    emailSearch.run().each(function (result) {
                        salesRepField = result.getValue({
                            name: 'salesrep'
                        });

                        let customerName = result.getValue({
                            name: 'entity'
                        });

                        let email = result.getValue({
                            name: 'email'
                        });

                        if (email === mail) {
                            log.debug({
                                title: 'Customer Details Fetched',
                                details: `Sales Rep ID: ${salesRepField} Customer Name: ${customerName} Email: ${email}`
                            });
                            
                            log.debug(salesRepField);
                            if(salesRepField)
                            {
                            record.submitFields({
                                type: 'customrecord_jj_custom_record',
                                id: record,
                                values: { 'custrecord5': salesRepField }
                            });
                            //customRecord.save();
                            }
                            
                        }
                        return true;
                    });
                }
                catch (e) {
                    log.debug({
                        title: 'Error in Creating Search',
                        details: e.stack
                    });
                }
            }

        }

        return { onRequest }

    });
