/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record'],
/**
 * @param{record} record
 */
function(record) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
        try
        {
            let currentRecord=scriptContext.currentRecord;
            let couponCheckbox=currentRecord.getValue({fieldId: 'custentity_jj_cust_apply_coupon'});
            validateCheckBox(currentRecord, couponCheckbox);
            log.debug({
                title: 'Page Loaded',
                details: 'Page Loaded Successfully'
            })

        }
        catch(e)
        {
            log.debug({
                title: 'Error in Loading Page',
                details: e.message
            });
        }        
    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
        try
        {
            let currentRecord=scriptContext.currentRecord;
            let fieldId = scriptContext.fieldId;
            if(fieldId == 'custentity_jj_cust_apply_coupon')
            {
                let applyCoupon=currentRecord.getValue({fieldId: 'custentity_jj_cust_apply_coupon'});
                validateCheckBox(currentRecord, applyCoupon);
                log.debug({
                    title: 'Field Changed',
                    details: 'Field Change Detected'
                })
            }
        }
        catch(e)
        {
            log.debug({
                title: 'Error in Field Change',
                details: e.message
            })
        }

    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {
        try
        {
            let currentRecord=scriptContext.currentRecord;
            let applyCoupon=currentRecord.getValue({fieldId:'custentity_jj_cust_apply_coupon'});
            let couponField=currentRecord.getValue({fieldId:'custentity_jj_cust_coupon_field'});

            if(applyCoupon && (couponField.length<5))
            {
                alert('Invalid Coupon/Coupon Code not Entered');
                return false;
            }
            log.debug({
                title: 'Validated the Field',
                details: 'Validated the Coupon Code Field'
            })

            log.debug({
                title: 'Saved the Record',
                details: 'Saved the record Successfully'
            })
            return true;
        }
        catch(e)
        {
            log.debug({
                title: 'Error in Saving Record',
                details: e.message
            });
            return false
        }
    }

    function validateCheckBox(cRecord, checkbox)
        {
            cRecord.getField({fieldId: 'custentity_jj_cust_coupon_field'}).isDisabled=!checkbox;
            console.log('Coupon Code field disabled');
            if(checkbox)
            {
                cRecord.setValue({
                    fieldId:'custentity_jj_cust_coupon_field',
                    value: ''
                });
                console.log('Coupon Code field enabled');
            }
        }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        // validateLine: validateLine,
        // validateInsert: validateInsert,
        // validateDelete: validateDelete,
        saveRecord: saveRecord
    };
    
});
