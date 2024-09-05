/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'],
    /**
 * @param{serverWidget} serverWidget
 */
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
                title: 'User Training'           
            });

            //form.clientScriptFileId = 57;  // this is using internal id of client scriot file
            
            form.clientScriptModulePath = 'SuiteScripts/JobinAndJismi/OTP-7524-SuiteScript_Training/jj_cs_bind_suitelet.js';
            /**
             * above is the module path, this will load the client script.
             */
            

            let fieldGroup = form.addFieldGroup({
                id: 'custpage_jj_newfield',
                label: 'Primary Informtion'
            });

            let fname = form.addField({
                id: 'custpage_jj_fname',
                label: 'First Name',
                type: serverWidget.FieldType.TEXT,
                container: 'custpage_jj_newfield'
            }).isMandatory = true;

            let lname = form.addField({
                id: 'custpage_jj_lname',
                label: 'Last Name',
                type: serverWidget.FieldType.TEXT,
                container: 'custpage_jj_newfield'
            }).isMandatory = true;

            let email = form.addField({
                id: 'custpage_jj_email',
                label: 'Email',
                type: serverWidget.FieldType.EMAIL,
                container: 'custpage_jj_newfield'
            });

            form.addResetButton({
                label: 'Reset'
            });

            form.addSubmitButton({
                label: 'Save'
            });

            let sublist = form.addSublist({
                id: 'custpage_jj_sublist',
                label: 'Search Results',
                type: serverWidget.SublistType.LIST
            })

            sublist.addMarkAllButtons();
            

            scriptContext.response.writePage(form);

            log.debug({
                title: 'Request',
                details: scriptContext.request.method
            })

        }

        return {onRequest}

    });
