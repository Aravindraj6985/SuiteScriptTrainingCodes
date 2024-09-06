/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/email', 'N/runtime'],
/**
 * @param{record} record
 */
function(record, email, runtime) {
    
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
            let poRec = scriptContext.currentRecord;
            console.log('Triggered');

            let vendorId = poRec.getValue({
                fieldId: 'entity'
            });
            console.log('Vendor: '+vendorId);

            let poNumber = poRec.getValue({
                fieldId: 'tranid'
            });
            console.log('PO Number: '+poNumber);

            let lineCount = poRec.getLineCount({
                sublistId: 'item'
            });
            console.log('Line Count: '+lineCount);
            
            let vendorRcd = record.load({
                type: record.Type.VENDOR,
                id: vendorId
            });
            let vendorEmail = vendorRcd.getValue({
                fieldId: 'email'
            })
            console.log('Vendor Email: '+vendorEmail);
            let itemUpdate = [];

            log.debug({
                title: 'triggered',
                details: 'vendorEmail'
            })

            for(let i=0; i<lineCount; i++)
                {
                    let item = poRec.getSublistText({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });
                    console.log('Item Name: '+item);
        
                    let initQty = poRec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: i
                    });
                    console.log('Initial Item Quantity: '+initQty);
        
                    let newQty = poRec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: i
                    });
                    console.log('New Item Quantity: '+newQty);
                    log.debug({
                        title: 'triggered',
                        details: item, initQty, newQty
                    })
                    if(initQty !== newQty)
                        {
                            itemUpdate.push({item : item, initQty : initQty, newQty :newQty});
                        }
                    }
                    if(itemUpdate.length > 0)
                    {
                        let subject = 'The Quantity Updated in the PO: '+poNumber;
                        let body = 'The following items in the item line have been updated: \n \n';
                        itemUpdate.forEach(function(items)
                        {
                            body += `Item Name: ${items.item} \n Old Quantity: ${items.initQty} \n New Quantity: ${items.newQty} \n\n`;
                        })
                        
                        email.send({
                            author: runtime.getCurrentUser().id,
                            body: body,
                            recipients: [vendorEmail],
                            subject: subject
                        })
                        console.log('Email Sent to: ' + vendorEmail);
                        log.debug({
                            title: 'mail sent',
                            details: 'mailed'
                        })
                    }
                
            
            return true;
        }
        catch(e)
        {
            log.debug({
                title: 'Error in Execution',
                details: e.stack 
            });
        }

    }

    return {
        // pageInit: pageInit,
        // fieldChanged: fieldChanged,
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

    

