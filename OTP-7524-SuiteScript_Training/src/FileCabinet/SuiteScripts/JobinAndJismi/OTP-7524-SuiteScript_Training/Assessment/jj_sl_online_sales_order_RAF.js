/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/email', 'N/render', 'N/http'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget, email, render, http) => {


        function createOnlineSalesOrder(scriptContext)
        {
            try
            {
                let form =serverWidget.createForm({
                    title: 'Online Sales Order'
                });

                form.addFieldGroup({
                    id: 'custpage_jj_primaryField',
                    label: 'Primay Information'
                });

                form.addField({
                    id: 'custpage_jj_fname',
                    label: 'First Name',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_jj_primaryField'
                }).isMandatory = true;

                form.addField({
                    id: 'custpage_jj_lname',
                    label: 'Last Name',
                    type: serverWidget.FieldType.TEXT,
                    container: 'custpage_jj_primaryField'
                }).isMandatory = true;

                form.addField({
                    id: 'custpage_jj_phone',
                    label: 'Phone Number',
                    type: serverWidget.FieldType.PHONE,
                    container: 'custpage_jj_primaryField'
                }).isMandatory = true;

                form.addField({
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
                });

                itemList.addField({
                    id: 'custpage_jj_itemdescription',
                    label: 'Description',
                    type: serverWidget.FieldType.TEXT,
                    source: 'item.salesdescription'
                });

                itemList.addField({
                    id: 'custpage_jj_itemquantity',
                    label: 'Quantity',
                    type: serverWidget.FieldType.FLOAT
                }).isMandatory = true;

                itemList.addField({
                    id: 'custpage_jj_itemprice',
                    label: 'Price',
                    type: serverWidget.FieldType.FLOAT,
                    source: 'item.baseprice'
                }).isMandatory = true;

                itemList.addField({
                    id: 'custpage_jj_itemamount',
                    label: 'Amount',
                    type: serverWidget.FieldType.FLOAT
                });

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


        function submitForm(scriptContext)
        {
            try
            {
                let request = scriptContext.request;
                let fname = request.parameters.custpage_jj_fname;
                let lname = request.parameters.custpage_jj_lname;
                let phone = request.parameters.custpage_jj_phone;
                let email = request.parameters.custpage_jj_email;
                let lineCount = request.getLineCount({
                    group: 'custpage_jj_itemsublist'
                    
                });

                let item = [];
                let quantity = [];
                for(let i=0; i<lineCount; i++)
                {
                    item.push(request.getSublistValue({
                        group: 'custpage_jj_itemsublist',
                        line: i,
                        name: 'custpage_jj_itemselect'
                    }));

                    quantity.push(request.getSublistValue({
                        group: 'custpage_jj_itemsublist',
                        line: i,
                        name: 'custpage_jj_itemquantity'
                    }));
                }
                
                let customerSearch = search.create({
                    type: search.Type.CUSTOMER,
                    filters: ['email', 'is', email],
                    columns: ['internalid','entityid', 'salesrep', 'subsidiary']
                });

                let searchResult = customerSearch.run().getRange({
                    start: 0,
                    end: 1
                });
                log.debug('Search Length: '+searchResult.length);
                
                let customerId = '';
                let customerSubsidiary = '';
                let customerSalesRep = '';
                if(searchResult.length > 0)
                {
                    customerSearch.run().each(function(result){
                        customerId = result.getValue('internalid');
                        customerSubsidiary = result.getValue('subsidiary');
                        customerSalesRep = result.getValue('salesrep');
                    })

                    let soId = createSalesOrder(customerId, customerSalesRep, item, quantity, lineCount);
                    log.debug('Sales Order Created. ID: '+soId);
                }
                else 
                {
                    let custName = fname+' '+lname;
                    let customerRecord = record.create({
                        type: record.Type.CUSTOMER
                    });

                    customerSubsidiary = 1;
                    customerSalesRep = -5;
                    customerRecord.setValue({fieldId: 'companyname', value: custName});
                    customerRecord.setValue({fieldId: 'subsidiary', value: customerSubsidiary});
                    customerRecord.setValue({fieldId: 'salesrep', value: customerSalesRep});
                    customerRecord.setValue({fieldId: 'phone', value: phone});
                    customerRecord.setValue({fieldId: 'email', value: email});
                    log.debug('Company Name: '+custName+' email: '+email);

                    let customerId = customerRecord.save();
                    log.debug({
                        title: 'Customer Record Created',
                        details: 'Customer Record ID: '+customerId
                    });

                    let soId = createSalesOrder(customerId, customerSalesRep, item, quantity, lineCount);
                    log.debug('Sales Order Created. ID: '+soId);
                }
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Submitting Online Form',
                    details: e.message
                });
            }
        }



        function createSalesOrder(customerId, customerSalesRep, item, quantity, lineCount)
        {
            try
            {
                let salesOrder = record.create({
                    type: record.Type.SALES_ORDER
                });
                salesOrder.setValue({fieldId: 'entity', value: customerId});
                log.debug('before');
                for(let i=0; i<lineCount; i++)
                {
                    salesOrder.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i,
                        value: item[i]
                    });

                    salesOrder.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: i,
                        value: quantity[i]
                    });
                }
                log.debug('after');
                salesOrder.setValue({
                    fieldId: 'orderstatus',
                    value: 'B'
                });

                let soId = salesOrder.save();

                let salesOrderRecord = record.load({
                    type: record.Type.SALES_ORDER,
                    id: soId
                });

                let amount = salesOrderRecord.getValue('total');
                if(amount > 500)
                {
                    let salesRepRecord = record.load({
                        type: record.Type.EMPLOYEE,
                        id: customerSalesRep
                    });

                    let supervisor = salesRepRecord.getValue('supervisor');
                    log.debug(supervisor);
                    if(supervisor)
                    {
                        let pdfFile = render.transaction({
                            entityId: soId,
                            printMode: render.PrintMode.PDF
                        });

                        email.send({
                            author: customerSalesRep,
                            body: 'A Sales Order (ID: '+soId+') have been generated for the customer with ID: '+customerId+'. Amount: '+amount,
                            recipients: supervisor,
                            subject: 'A Sales Orderhave been genereated with amount greater than 500 USD.',
                            attachments: [pdfFile]
                        });
                        log.debug('Email send to '+supervisor);
                    }
                    else
                    {
                        log.debug('Supervisor not found. Email not send');
                    }
                }
                return soId;
                
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Creating Sales Order',
                    details: e.message
                });
                log.debug(e.cause);
                log.debug(e.stack);
            }
        }



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
                    submitForm(scriptContext);
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

        

        

        

        return {onRequest}

    });
