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

            let vendor=542;
            let item=102;
            let new_po=record.create({
                type: record.Type.PURCHASE_ORDER,
                isDynamic: true
            })

            new_po.setValue({
                fieldId: 'entity',
                value: vendor
            })

            new_po.selectNewLine({
                sublistId: 'item'
            })

            new_po.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                value: item
            })

            new_po.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                value: 2
            })

            new_po.commitLine({
                sublistId: 'item'
            })

            let po_id=new_po.save();
            
            log.debug({
                title: 'New Purchase Order Created',
                details: 'Purcahse Order ID: '+po_id+'  Vendor ID: '+vendor
            })



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

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
