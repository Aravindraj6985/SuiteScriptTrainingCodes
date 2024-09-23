/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try
            {
                log.debug({
                    title: 'Response',
                    details: scriptContext.request.method
                });

                if (scriptContext.request.method === 'GET')
                {
                    createOnlineSalesOrder(scriptContext);
                }
                else if (scriptContext.request.method === 'POST')
                {

                }
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Execution',
                    details: e.message
                });
            }

        }

        function createOnlineSalesOrder(scriptContext)
        {
            try
            {
                let form =serverWidget.createForm({
                    title: 'Online Sales Order'
                });

                let primaryFieldGroup = form.addFieldGroup({
                    id: 'custpage_jj_primaryField',
                    label: 'Primay Information'
                });

                let fname = form.addField({
                    id: 'custpage_jj_fname',
                    label: 'First Name',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_jj_primaryField'
                }).isMandatory = true;

                let lname = form.addField({
                    id: 'custpage_jj_lname',
                    label: 'Last Name',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_jj_primaryField'
                }).isMandatory = true;

                let phone = form.addField({
                    id: 'custpage_jj_phone',
                    label: 'Phone Number',
                    type: serverWidget.FieldType.PHONE,
                    container: 'custpage_jj_primaryField'
                }).isMandatory = true;

                let email = form.addField({
                    id: 'custpage_jj_email',
                    label: 'Email',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_jj_primaryField'
                }).isMandatory = true;

                form.addResetButton({
                    label: 'Reset'
                });

                form.addSubmitButton({
                    label: 'Save'
                });

                let itemList = form.addSublist({
                    id: 'custpage_jj_itemsublist',
                    label: 'Items',
                    type: serverWidget.SublistType.INLINEEDITOR
                });

                itemList.addField({
                    id: 'custpage_jj_itemselect',
                    label: 'Items',
                    type: serverWidget.FieldType.SELECT,
                    source: 'inventoryitem'
                }).isMandatory = true;

                // item.addSelectOption({
                //     value: '',
                //     text: 'Select Item'
                // });

                itemList.addField({
                    id: 'custpage_jj_itemdescription',
                    label: 'Description',
                    type: serverWidget.FieldType.TEXT,
                    source: 'item.salesdescription'
                }).isMandatory = true;

                itemList.addField({
                    id: 'custpage_jj_itemquantity',
                    label: 'Quantity',
                    type: serverWidget.FieldType.TEXT
                }).isMandatory = true;

                itemList.addField({
                    id: 'custpage_jj_itemprice',
                    label: 'Price',
                    type: serverWidget.FieldType.TEXT,
                    source: 'item.baseprice'
                }).isMandatory = true;

                itemList.addField({
                    id: 'custpage_jj_itemamount',
                    label: 'Amount',
                    type: serverWidget.FieldType.TEXT
                }).isMandatory = true;

                form.clientScriptModulePath = 'SuiteScripts/JobinAndJismi/OTP-7524-SuiteScript_Training/Assessment/jj_cs_online_sales_order_RAF.js';
                scriptContext.response.writePage(form);

            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Creating Online Form',
                    details: e.message
                });
            }
        }

        return {onRequest}

    });
