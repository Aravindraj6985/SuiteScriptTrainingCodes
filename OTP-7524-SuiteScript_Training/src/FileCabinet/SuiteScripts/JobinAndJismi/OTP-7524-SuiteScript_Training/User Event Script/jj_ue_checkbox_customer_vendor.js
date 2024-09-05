/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/redirect'],
    /**
 * @param{record} record
 * @param{redirect} redirect
 */
    (record, redirect) => {
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

            try{
                if(scriptContext.type==scriptContext.UserEventType.CREATE)
                {
                   let transaction=scriptContext.newRecord;
                   let entity=transaction.getValue('entity');
                   let record_type=scriptContext.newRecord.type;
                   if(record_type==record.Type.SALES_ORDER)
                   {
                    sales_order(entity);
                    log.debug({
                        title: 'Sales Order',
                        details: 'Sales Order Created'
                    })
                   }
                   else if(record_type==record.Type.PURCHASE_ORDER)
                   {
                    purchase_order(entity);
                    log.debug({
                    title: 'Purchase Order',
                    details: 'Purchase Order Created'
                    })
                   } 
                }
            }
            catch(e){
                log.debug({
                    title: 'Failed to create',
                    details: e.message
                })
            }

            function sales_order(cust_id)
            {
                try{
                    let cust=record.load({
                        type: record.Type.CUSTOMER,
                        id: cust_id
                    })
             
                    cust.setValue({
                        fieldId: 'custentityorder_created_checkbox',
                        value: true
                    })
                    cust.save();
                }
                catch(e){
                    log.debug({
                        title: 'Error in setting checkbox',
                        details: e.message
                    })
                }
            }

            function purchase_order(vendor_id)
            {
                try{
                    let vendor=record.load({
                        type: record.Type.VENDOR,
                        id: vendor_id
                    })
                
                    vendor.setValue({
                        fieldId: 'custentityorder_created_checkbox',
                        value: true
                    })
                    vendor.save();
                }
                catch(e){
                    log.debug({
                        title: 'Error in setting checkbox',
                        details: e.message
                    })
                }
            } 
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
