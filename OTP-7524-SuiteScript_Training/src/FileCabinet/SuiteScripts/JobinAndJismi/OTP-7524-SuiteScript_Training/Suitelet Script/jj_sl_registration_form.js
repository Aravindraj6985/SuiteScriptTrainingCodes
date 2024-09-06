/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'],
    
    (serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            log.debug({
                title: 'Request',
                details: scriptContext.request.method
            })
            let form = serverWidget.createForm({
                title: 'Registration Form'           
            });

            let name = form.addField({
                id: 'cust_jj_name',
                label: 'Name',
                type: serverWidget.FieldType.TEXT
            });

            let age = form.addField({
                id: 'cust_jj_age',
                label: 'Age',
                type: serverWidget.FieldType.INTEGER
            });

            let phoneNumber = form.addField({
                id: 'cust_jj_phone_number',
                label: 'Phone Number',
                type: serverWidget.FieldType.PHONE
            });

            let email = form.addField({
                id: 'cust_jj_email',
                label: 'Email',
                type: serverWidget.FieldType.EMAIL
            });

            let fatherName = form.addField({
                id: 'cust_jj_fathername',
                label: "Father's Name",
                type: serverWidget.FieldType.TEXT
            });

            let address = form.addField({
                id: 'cust_jj_address',
                label: 'Address',
                type: serverWidget.FieldType.LONGTEXT
            });

            form.addResetButton({
                label: 'Reset'
            });

            form.addSubmitButton({
                label: 'Save'
            });

            scriptContext.response.writePage(form);

            log.debug({
                title: 'Request',
                details: scriptContext.request.method
            });


        }

        return {onRequest}

    });
