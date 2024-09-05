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

        try
        {
            if(scriptContext.fieldId === 'item')
            {
                let cRec = scriptContext.currentRecord;
                let itemId = cRec.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item'
                });
                console.log('Item Id: '+itemId);
    
                let itemRcd = record.load({
                    type: record.Type.INVENTORY_ITEM,
                    id: itemId
                });
    
                let length=itemRcd.getValue({fieldId: 'custitem_jj_length_item'});
                let breadth=itemRcd.getValue({fieldId: 'custitem_jj_breadth_item'});
                let height=itemRcd.getValue({fieldId: 'custitem_jj_height_item'});
                console.log(`Length: ${length}, Breadth: ${breadth}, Height: ${height}`);
    
                setContainerBoxValue(cRec, length, breadth, height);       
            }
        }
        catch(e)
        {
            log.debug({
                title: 'Error In Execution',
                details: e.message
            });
        }

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

    }

    function setContainerBoxValue(rec, len, bre, hei)
    {
        let rate = rec.getCurrentSublistValue({
            sublistId: 'item',
            fieldId: 'rate'
        });

        console.log('Rate: '+rate);

        let cBoxValue = len * bre * hei;
        console.log('Calculated Container Box Value: '+cBoxValue);

        if(cBoxValue !==0)
        {
            rec.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_jj_cpntainer_box',
                value: cBoxValue,
                ignoreFieldChange: true
            });
     
            let amount = rate * cBoxValue;
            rec.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'amount',
                value: amount,
                ignoreFieldChange: true
            });
            console.log('Amount: '+amount);
    
            Record.commitLine({
                sublistId: 'item'
            })
        }
        
    }

    return {
        // pageInit: pageInit,
        // fieldChanged: fieldChanged,
         postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        // validateLine: validateLine,
        // validateInsert: validateInsert,
        // validateDelete: validateDelete,
        // saveRecord: saveRecord
    };
    
});
