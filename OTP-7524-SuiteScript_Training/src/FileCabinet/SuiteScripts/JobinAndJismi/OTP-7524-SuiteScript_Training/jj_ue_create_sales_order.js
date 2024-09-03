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

            let customer=437;
            let item=102;
            let new_sales_order=record.create({
                type: record.Type.SALES_ORDER,
                isDynamic: true,
            })

            new_sales_order.setValue({
                fieldId: 'entity',
                value: customer,
            })

            new_sales_order.selectNewLine({
                sublistId: 'item'
            })

            new_sales_order.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                value: item
            })

            new_sales_order.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                value: 1
            })

            new_sales_order.commitLine({
                sublistId: 'item'
            })

            let orderid=new_sales_order.save();

            log.debug({
                title: 'New Sales Order Created',
                details: 'Sales Order ID: '+orderid
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
