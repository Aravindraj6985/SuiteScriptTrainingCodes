/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

/**
 * **************************************************************************************************************************************
 * Onboard Training Project
 * 
 * OTP:-7932-Identify Change in Address
 * 
 * 
 * ***************************************************************************************************************************************
 * 
 * Author: - Jobin and Jismi IT Services
 * 
 * Date Created: - 18/09/2024
 * 
 * Description: - Identify change in address if existing address is changed or new address is added to customer record in EDIT mode 
 *                and check a custom checkbox in customer record if new or existing address is changed.
 * 
 * Revision History 
 * 
 * @version 1.0 OTP:-7932 : 18/09/2024 : Created the initial build. 
 * 
 * 
 * **************************************************************************************************************************************
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
                    let oldRec = scriptContext.oldRecord;               //Old record
                    let newRec = scriptContext.newRecord;               //New record
                    getOldAndNewAddressAndUpdateField(oldRec, newRec);  //calling user defined function to update thecheckbox on customer record.
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

        function getOldAndNewAddressAndUpdateField(oldRecord, newRecord) //creating user defined function to update thecheckbox on customer record.
        {
            try 
            {
                let oldRecAddressCount = oldRecord.getLineCount({   //Fetching the old record address line count
                    sublistId: 'addressbook'
                });
                log.debug('Old Line Count: ' + oldRecAddressCount);

                let newRecAddressCount = newRecord.getLineCount({   //Fetching the new record address line count
                    sublistId: 'addressbook'
                });
                log.debug('New Line Count: ' + newRecAddressCount);

                if (oldRecAddressCount === newRecAddressCount)      //condition to check whether the old and new lines are equal
                {                                                   //Entered the condition if line counts are same.
                    let oldAddress = '';                            //initializing old address 
                    let newAddress = '';                            //initializing new address 
                    for (let i = 0; i < oldRecAddressCount; i++)    //for loop to iterate over all address
                    {
                        oldAddress = oldRecord.getSublistText({     //getting the old address in ith line
                            sublistId: 'addressbook',
                            fieldId: 'addressbookaddress_text',
                            line: i
                        });
                        log.debug('Old Address: ' + oldAddress);    //getting the new address in ith line

                        newAddress = newRecord.getSublistText({
                            sublistId: 'addressbook',
                            fieldId: 'addressbookaddress_text',
                            line: i
                        });
                        log.debug('New Address: ' + newAddress);

                        if (oldAddress !== newAddress)              //condition to check if old and new address are equal
                        {
                            newRecord.setValue({                    //if adress are equal set the checkbox to true
                                fieldId: 'custentity_jj_address_change',
                                value: true
                            });
                            log.debug('Checkbox set to TRUE. Address changed or updated');
                            break;
                        }
                        else 
                        {
                            newRecord.setValue({                    //if adress are not equal set the checkbox to false
                                fieldId: 'custentity_jj_address_change',
                                value: false
                            });
                            log.debug('Checkbox set to FALSE. Address not changed or updated');
                        }
                    }  
                }

                else                                                //if old and new record address line count are not equal set the checkbox to true
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
