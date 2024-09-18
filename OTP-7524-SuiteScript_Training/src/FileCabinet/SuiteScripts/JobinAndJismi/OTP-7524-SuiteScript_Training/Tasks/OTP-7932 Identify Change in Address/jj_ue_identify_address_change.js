/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
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

            try 
            {
                if (scriptContext.type === scriptContext.UserEventType.EDIT) 
                {
                    let oldRec = scriptContext.oldRecord;
                    let newRec = scriptContext.newRecord;
                    getOldAndNewAddressAndUpdateField(oldRec, newRec);
                }
            }
            catch (e) 
            {
                log.debug({
                    title: 'Error in Executing',
                    details: e.message
                })
                log.debug(e.cause);
            }

        }

        function getOldAndNewAddressAndUpdateField(oldRecord, newRecord) 
        {
            try 
            {
                let oldRecAddressCount = oldRecord.getLineCount({
                    sublistId: 'addressbook'
                });
                log.debug('Old Line Count: ' + oldRecAddressCount);

                let newRecAddressCount = newRecord.getLineCount({
                    sublistId: 'addressbook'
                });
                log.debug('New Line Count: ' + newRecAddressCount);

                if (oldRecAddressCount === newRecAddressCount) 
                {
                    let oldAddress = '';
                    let newAddress = '';
                    for (let i = 0; i < oldRecAddressCount; i++) 
                    {
                        oldAddress = oldRecord.getSublistText({
                            sublistId: 'addressbook',
                            fieldId: 'addressbookaddress_text',
                            line: i
                        });
                        log.debug('Old Address: ' + oldAddress);

                        newAddress = newRecord.getSublistText({
                            sublistId: 'addressbook',
                            fieldId: 'addressbookaddress_text',
                            line: i
                        });
                        log.debug('New Address: ' + newAddress);

                        if (oldAddress !== newAddress) 
                        {
                            newRecord.setValue({
                                fieldId: 'custentity_jj_address_change',
                                value: true
                            });
                            log.debug('Checkbox set to TRUE. Address changed or updated');
                            break;
                        }
                        else 
                        {
                            newRecord.setValue({
                                fieldId: 'custentity_jj_address_change',
                                value: false
                            });
                            log.debug('Checkbox set to FALSE. Address not changed or updated');
                        }
                    }  
                }

                else 
                {
                    newRecord.setValue({
                        fieldId: 'custentity_jj_address_change',
                        value: true
                    });
                    log.debug('Checkbox set to TRUE. Address changed or updated');
                }

            }
            catch (e) 
            {
                log.debug({
                    title: 'Error in fetching address and updating checkbox',
                    details: e.message
                });
            }
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

        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    });
