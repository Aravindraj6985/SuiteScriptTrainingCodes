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
            if (context.fieldId === 'location') {
                var salesOrderRecord = context.currentRecord;
                var bodyLocation = salesOrderRecord.getValue('location');
                var lineCount = salesOrderRecord.getLineCount({ sublistId: 'item' });
        
                for (var i = 0; i < lineCount; i++) {
                    salesOrderRecord.selectLine({ sublistId: 'item', line: i });
                    var lineLocation = salesOrderRecord.getCurrentSublistValue({ sublistId: 'item', fieldId: 'location' });
        
                    // Override the existing location with the body location
                    if (lineLocation !== bodyLocation) {
                        salesOrderRecord.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'location',
                            value: bodyLocation,
                            ignoreFieldChange: true
                        });
                        salesOrderRecord.commitLine({ sublistId: 'item' });
                    }
                }
            }
        //    let cRecord = scriptContext.currentRecord;
        //    if(cRecord.fieldId == 'location')
        //    {
        //         let baseLocation = cRecord.getValue({fieldId: 'location'});
        //         console.log('Body Location '+baseLocation);
        //         log.debug({
        //             title: 'Body Location Retrived',
        //             details: 'Location ID: '+baseLocation
        //         });

        //         let lineCount = cRecord.getLineCount({sublistId: 'item'});
        //         console.log('Line Count '+lineCount);
        //         log.debug({
        //             title: 'Item line count',
        //             details: 'Count: '+lineCount
        //         });

        //         for (let i=0; i<lineCount; i++)
        //         {
        //             CurrentRecord.selectLine({sublistId: 'item', line: i});
        //             let lineLocation = cRecord.getCurrentSublistValue({sublistId: 'item', fieldId: 'location'});
        //             console.log('Line Location '+lineLocation);
        //             log.debug({
        //                 title: 'Line Location Retrived',
        //                 details: 'Location ID: '+lineLocation
        //             });

        //             if(lineLocation !== bodyLocation)
        //             {
        //                 CurrentRecord.setCurrentSublistValue({
        //                     sublistId: 'item',
        //                     fieldId: 'location',
        //                     value: baseLocation,
        //                     ignoreFieldChange: true
        //                 });
        //                 console.log('Line and Body Location Set');
        //                 log.debug({
        //                     title: 'Line and Body Location Set to matching',
        //                     details: 'Location ID: '+baseLocation
        //                 });
        //             }
        //             cRecord.commitLine({sublistId: 'item'});
        //        }
        //  }
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

        var currentRecord = context.currentRecord;
        var bodyLocation = currentRecord.getValue('location');
        var lineCount = currentRecord.getLineCount({ sublistId: 'item' });

        for (var i = 0; i < lineCount; i++) {
            var lineLocation = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'location', line: i });

            if (lineLocation !== bodyLocation) {
                alert('Location mismatch: All line items must match the body-level location.');
                return false;
            }
        }
        return true;

    }

    function setLineLocation(cRec, bLocation)
    {

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
