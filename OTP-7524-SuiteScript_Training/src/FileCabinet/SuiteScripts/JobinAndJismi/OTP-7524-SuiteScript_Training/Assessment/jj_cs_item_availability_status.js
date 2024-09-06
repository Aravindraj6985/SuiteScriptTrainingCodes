/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],
/**
 * @param{record} record
 * @param{search} search
 */
function(record, search) {
    
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
        try
        {
            if(scriptContext.fieldId === 'item'

                
            )
            {
                let cRec = scriptContext.currentRecord;
                let lineCount = cRec.getLineCount({
                    sublistId: 'item'
                });
                // for(let i=0; i<lineCount; i++)
                // {
                    let itemId = cRec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item'
                    });
                    console.log('Item Id: '+itemId);
                    
                    let qtyOrdered = cRec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity'
                    });
                    console.log('Quantity Ordered: '+qtyOrdered);
    
                    // let itemRcd = record.load({
                    //     type: record.Type.INVENTORY_ITEM,
                    //     id: itemId
                    // });
                    // console.log('record loaded'+itemRcd)
    
                    let qty = cRec.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantityonhand'
                    });
                    console.log('Quantity Available: '+qty);

                    cRec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_jj_item_availability',
                        value: qty
                    })
    
                    if(qtyOrdered < qty  || qtyOrdered === qty)
                    {
                        cRec.setValue({
                            fieldId: 'custbody_jj_item_availability_status',
                            value: 'Available'
                        })
                    }
    
                    else(qtyOrdered > qty)
                    {
                        cRec.setValue({
                            fieldId: 'custbody_jj_item_availability_status',
                            value: 'Backordered'
                        })
                    }
               // }
                

            }
        }
        catch(e)
        {
            log.debug({
                title: 'Error in Execution',
                details: e.stack
            });
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
            let cRecord=scriptContext.currentRecord;
            let statusField = cRecord.getValue({
                fieldId: 'custbody_jj_item_availability_status'
            });

            if(statusField === 'Available')
            {
                console.log('Sale Order Saved');
                return true;
            }

            else if(statusField === 'Backordered')
            {
                console.log('Sale Order Not Saved');
                alert('Quantity not available');
                return false;
            }
    
        }
        catch(e)
        {
            log.debug({
                title: 'Error in Saving',
                details: e.stack
            });
        }


    }

    return {
        // pageInit: pageInit,
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
