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
        debugger;
        try
        {
            if(fieldId === 'location')
            {
                let cRecord = scriptContext.currentRecord;
                let bodyLocation=cRecord.getValue({fieldId: 'location'});
                console.log('Body Location: '+bodyLocation);

                log.debug({
                    title: 'Body Location Fetched',
                    details: 'Location From Body Fetched: '+bodyLocation
                });

                let lineCount=cRecord.getLineCount({sublistId: 'item'});
                console.log('Line Count: '+lineCount);

                log.debug({
                    title: 'Line Count',
                    details: 'Number of lines: '+lineCount
                });

                for(let i=0; i<lineCount; i++)
                {
                    cRecord.selectLine('item', i );
                    cRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'location',
                        value: bodyLocation
                    });

                    console.log('Line location set to '+bodyLocation);
                    log.debug({
                        title: 'Line Location Set',
                        details: 'Line location set is '+bodyLocation
                    });
                    cRecord.commitLine({sublistId: 'item'});
                    console.log('Commited line');
                }

            }
            
            // let fieldId = scriptContext.fieldId;
            // let subFieldId = scriptContext.sublistId;
            // if(fieldId === 'location')
            // {
                
            //     log.debug({
            //         title: 'Body Location Fetched',
            //         details: 'Location From Body Fetched: '+location
            //     });
            //     console.log('Body Location: '+location);
            //}

            // if(subFieldId === 'item')
            // {
            //     let itemLocation=cRecord.getValue({fieldId: 'item.location'})
            //     log.debug({
            //         title: 'Line Location Fetched',
            //         details: 'Location From Line Fetched: '+itemLocation
            //     });
            //     console.log('line Location: '+itemLocation);
            // }
                
        }
        catch(e)
        {
            log.debug({
                title: 'Error in Field Validation',
                details: e.message
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
        // saveRecord: saveRecord
    };
    
});
