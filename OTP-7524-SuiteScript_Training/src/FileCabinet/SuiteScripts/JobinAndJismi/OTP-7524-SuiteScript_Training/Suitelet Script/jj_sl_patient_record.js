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
                    createPatientDetailsForm();
                    log.debug({
                        title: 'Patient Details',
                        details: 'Patient Details Entered'
                    });
                }
                else if(scriptContext.request.method === 'POST')
                {
                    let patientId = createCustomPatientRecord()
                    log.debug({
                        title: 'Patient Record',
                        details: 'Patient Record Created. Patient ID: '+patientId
                    });
                }
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Execution',
                    details: e.message
                });
            }
            
            function createPatientDetailsForm()
            {
                try
                {
                    let form = serverWidget.createForm({
                        title: 'Patient Details Entry Form'
                    });
    
                    form.addFieldGroup({
                        id: 'cust_jj_fieldgroup',
                        label: 'Primary Information'
                    });
    
                    form.addField({
                        id: 'cust_jj_name',
                        label: 'Name',
                        type: serverWidget.FieldType.TEXT,
                        container: 'cust_jj_fieldgroup'
                    }).isMandatory = true;
    
                    form.addField({
                        id: 'cust_jj_age',
                        label: 'Age',
                        type: serverWidget.FieldType.INTEGER,
                        container: 'cust_jj_fieldgroup'
                    }).isMandatory = true;
    
                    // let sexField = form.addField({
                    //     id: 'cust_jj_sex',
                    //     label: 'Sex',
                    //     type: serverWidget.FieldType.SELECT,
                    //     container: 'cust_jj_fieldgroup'
                    // }).isMandatory = true;

                    // sexField.addSelectOption({
                    //     value: 'Male',
                    //     text: 'Male'
                    // });

                    // sexField.addSelectOption({
                    //     value: 'Female',
                    //     text: 'Female'
                    // });

                    // sexField.addSelectOption({
                    //     value: 'Other',
                    //     text: 'Other'
                    // })
    
                    form.addField({
                        id: 'cust_jj_address',
                        label: 'Address',
                        type: serverWidget.FieldType.LONGTEXT,
                        container: 'cust_jj_fieldgroup'
                    }).isMandatory = true;
    
                    form.addSubmitButton({
                        label: 'Submit'
                    });
    
                    form.addResetButton({
                        label: 'Reset'
                    });

                    scriptContext.response.writePage(form);
                }
                catch(e)
                {
                    log.debug({
                        title: 'Error in Saving Form',
                        details: e.message
                    });
                }
            }

            function createCustomPatientRecord()
            {
                try
                {
                    let request = scriptContext.request;
                    let name = request.parameters.cust_jj_name;
                    let age = request.parameters.cust_jj_age;
                    //let sex = request.parameters.cust_jj_sex;
                    let address = request.parameters.cust_jj_address;

                    let patientRecord = record.create({
                        type: 'customrecord_jj_patient_record',
                        isDynamic: true
                    });

                    patientRecord.setValue({fieldId: 'altname',value: name});
                    patientRecord.setValue({fieldId: 'custrecord_jj_age',value: age});
                    //patientRecord.setValue({fieldId: 'custrecord_jj_sex',value: sex});
                    patientRecord.setValue({fieldId: 'custrecord_jj_address',value: address});

                    let patientId = patientRecord.save();
                    log.debug({
                        title: 'Patient Created',
                        details: 'Patient Internal ID: '+patientId
                    });
                    return patientId;
                }
                catch(e)
                {
                    log.debug({
                        title: 'Error in Creating Patient Record',
                        details: e.stack
                    });  
                }
            }


        }

        return {onRequest}

    });
