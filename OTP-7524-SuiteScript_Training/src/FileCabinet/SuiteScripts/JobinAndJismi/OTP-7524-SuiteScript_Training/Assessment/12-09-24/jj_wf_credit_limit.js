/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/search', 'N/email', 'N/runtime'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search, email, runtime) => {
        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */
        const onAction = (scriptContext) => {
            try
            {
                    verifyCreditLimitChange();
                    //return newLimit;
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Executing',
                    details: e.stack
                });
            }

            function verifyCreditLimitChange()
            {
                try
                {
                    let oldRec = scriptContext.oldRecord;
                    let newRec = scriptContext.newRecord;

                    let oldCreditLimit = oldRec.getValue({
                        fieldId: 'creditlimit'
                    });
                   
                    let newCreditLimit = newRec.getValue({
                        fieldId: 'creditlimit'
                    });
                    
                    if(oldCreditLimit === null || newCreditLimit === null)
                    {
                        log.error ('Invalid Credit Limit', 'Either old or new credit limit is null');
                        return;
                    }
                    let salesRep = newRec.getValue({
                        fieldId: 'salesrep'
                    });

                    let creditLimitChangeField = 'custentity_jj_credit_limit_changed';
                    let thresholdField = 'custentity_jj_credit_limit_threshold';

                    log.debug('Old Credit Limit: '+oldCreditLimit)
                    log.debug('  New Credit Limit: '+newCreditLimit);
                    if(oldCreditLimit !== newCreditLimit)
                    {                      
                        newRec.setValue({
                            fieldId: creditLimitChangeField,
                            value: 'Credit Limit Updated'
                        });

                        if(newCreditLimit > 50000)
                        {
                            if(salesRep)
                            {
                                log.debug('Sales Rep ID: '+salesRep);
                                let salesRepEmail = getSalesRepEmail(salesRep);
                                if(salesRepEmail)
                                {
                                    log.debug('Sales Rep email: '+salesRepEmail);
                                    email.send({
                                        author: runtime.getCurrentUser().id,
                                        body: `The credit limit of the Customer: ${newRec.getValue({
                                            fieldId: 'entity'})} have been updated to ${creditLimit}`,
                                        recipients: salesRepEmail,
                                        subject: 'Credit Limit Updated'
                                    });
                                }
                                else
                                {
                                    log.error('Email not found for sales rep: '+salesRep);
                                }
                                
                            }

                            newRec.setValue({
                                fieldId: thresholdField,
                                value: true
                            });
                        }
                        else
                        {
                            console.log('Credit limit updated below 50000');
                        }
                    }
   
                }
                catch(e)
                {
                    log.debug({
                        title: 'Error in loading customer',
                        details: e.stack
                    });
                }
            }

            function getSalesRepEmail(repId)
            {
                let emailSearch = search.lookupFields({
                    type: search.Type.EMPLOYEE,
                    id: repId,
                    columns: ['email']
                });
                return emailSearch.email || null;
            }

        }

        return {onAction};
    });
