/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/email', 'N/runtime'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search, email, runtime) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

            try
            {
                newRecordCreated();
            }

            catch(e){
                log.debug({
                    title: 'Error in Execution',
                    details: e.message
                });
            }

            function newRecordCreated()
            {
                let entityRecord = scriptContext.newRecord;
                let entity = entityRecord.getValue('entity');
                let recordType = entityRecord.type;
                let recordId = entityRecord.id;
                let user = runtime.getCurrentUser().id;
                let recepientEmail=runtime.getCurrentUser().email;
                let subject, body;

                if(scriptContext.type === scriptContext.UserEventType.CREATE)
                {
                    subject = 'Record Created :'+recordType;
                    body =  `A new ${recordType} record have been created. \n\n
                            Record type: ${recordType}\n
                            Internal ID: ${recordId}\n 
                            Name: ${entity}\n\n
                            This email was sent by: ${runtime.getCurrentUser().name}`;

                    log.debug({
                        title: 'Record Created',
                        details: `A new ${recordType} record have been created.`
                    })
                }

                else if(scriptContext.type === scriptContext.UserEventType.DELETE)
                {
                    subject = 'Record Deleted :'+recordType;
                    body = `A ${recordType} record have been deleted. \n\n
                            Record type: ${recordType}\n
                            Internal ID: ${recordId}\n 
                            Name: ${entity}\n\n
                            This email was sent by: ${runtime.getCurrentUser().name}`;
                    
                    log.debug({
                        title: 'Record Deleted',
                        details: `A ${recordType} record have been deleted.`
                    })
                }

                if (recepientEmail) {
                    email.send({
                        author: user,
                        recipients: recepientEmail,
                        subject: subject,
                        body: body
                    });
                }


            }
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
