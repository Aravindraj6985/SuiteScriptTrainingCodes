/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record'],
    /**
 * @param{serverWidget} serverWidget
 */
    (serverWidget, record) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            if(scriptContext.request.method === 'GET')
            {
                log.debug({
                    title: 'Request',
                    details: scriptContext.request.method
                });

                let form = serverWidget.createForm({
                    title: 'Customer Information Form'
                });

                let name = form.addField({
                    id: 'cust_jj_name',
                    label: 'Name',
                    type: serverWidget.FieldType.TEXT
                }).isMandatory = true;
    
                let email = form.addField({
                    id: 'cust_jj_email',
                    label: 'Email',
                    type: serverWidget.FieldType.EMAIL
                }).isMandatory = true;
    
                let phone = form.addField({
                    id: 'cust_jj_phone',
                    label: 'Phone',
                    type: serverWidget.FieldType.PHONE
                });
    
                let salesRep = form.addField({
                    id: 'cust_jj_salesrep',
                    label: 'Sales Rep',
                    type: serverWidget.FieldType.TEXT
                });
    
                let subsidiary = form.addField({
                    id: 'cust_jj_subsidiary',
                    label: 'Subsidiary',
                    type: serverWidget.FieldType.TEXT
                }).isMandatory = true;
    
                form.addResetButton({
                    label: 'Reset'
                });
    
                form.addSubmitButton({
                    label: 'Save'
                });
    
                scriptContext.response.writePage(form);    
            }
            else
            {
                log.debug({
                    title: 'Request',
                    details: scriptContext.request.method
                });

                let request = scriptContext.request;
                let customerName = request.parameters.cust_jj_name;
                let email = request.parameters.cust_jj_email;
                let phone = request.parameters.cust_jj_phone;
                let salesRep = request.parameters.cust_jj_salesrep;
                let subsidiary = request.parameters.cust_jj_subsidiary;

                let form = serverWidget.createForm({
                    title: 'Customer Information'
                })

                form.addField({
                    id: 'cust_disp_name',
                    label: 'Name',
                    type: serverWidget.FieldType.TEXT
                }).defaultValue = customerName;

                form.addField({
                    id: 'cust_disp_email',
                    label: 'Email',
                    type: serverWidget.FieldType.TEXT
                }).defaultValue = email;

                form.addField({
                    id: 'cust_disp_phone',
                    label: 'Phone',
                    type: serverWidget.FieldType.TEXT
                }).defaultValue = phone;

                form.addField({
                    id: 'cust_disp_salesrep',
                    label: 'Sales Rep',
                    type: serverWidget.FieldType.TEXT
                }).defaultValue = salesRep;

                form.addField({
                    id: 'cust_disp_subsidiary',
                    label: 'Subsidiary',
                    type: serverWidget.FieldType.TEXT
                }).defaultValue = subsidiary;

                scriptContext.response.writePage(form);

                let customerRecord = record.create({
                    type: record.Type.CUSTOMER,
                    isDynamic: true
                });

                customerRecord.setValue({fieldId: 'companyname',value: customerName});
                customerRecord.setValue({fieldId: 'email',value: email});
                customerRecord.setValue({fieldId: 'phone',value: phone});
                customerRecord.setValue({fieldId: 'salesrep',value: salesRep});
                customerRecord.setValue({fieldId: 'subsidiary',value: subsidiary});

                let custId = customerRecord.save();
                log.debug({
                    title: 'Customer Created',
                    details: 'Customer Internal ID: '+custId
                });
            }
            


            
        }

        return {onRequest}

    });
