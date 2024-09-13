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
                
                if(scriptContext.request.method === 'GET')
                {
                    createCommissionForm(scriptContext);
                    
                }
                else if(scriptContext.request.method === 'POST')
                {
                    createCommissionRecord(scriptContext);
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

        function createCommissionForm(scriptContext)
        {
            try
            {
                let form = serverWidget.createForm({
                    title: 'Commission Form'
                });

                let salesRepField = form.addField({
                    id: 'cust_jj_salesrep_filter',
                    label: 'Sales Rep',
                    type: serverWidget.FieldType.SELECT
                });
                createSalesRepSearch(salesRepField)

                let commission = form.addField({
                    id: 'cust_jj_commission',
                    label: 'Commission',
                    type: serverWidget.FieldType.FLOAT
                });

                form.addSubmitButton({
                    label: 'Submit'
                });

                scriptContext.response.writePage(form);
                log.debug('Form Created');
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Creating Form',
                    details: e.stack
                });
            }
        }

        function createSalesRepSearch(salesRep)
        {
            try
            {
                salesRep.addSelectOption({
                    value: '',
                    text: 'Select Sales Rep'
                });

                let salesRepSearch = search.create({
                    type: search.Type.EMPLOYEE,
                    filters: [['salesrep', 'is', ['T']], 'and', ['isinactive', 'is', ['F']]] ,
                    columns: ['entityid']
                });

                salesRepSearch.run().each(function(result){
                    salesRep.addSelectOption({
                        value: result.id,
                        text: result.getValue('entityid')
                    });
                    return true;
                });
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Creating sales rep search',
                    details: e.stack
                });
                log.debug(e.message);
                log.debug(e.cause);
            }
        }

        function createCommissionRecord(scriptContext)
        {
            try
            {
                let request = scriptContext.request;
                let salesRepNameValue = request.parameters.cust_jj_salesrep_filter;
                let commissionValue = request.parameters.cust_jj_commission;

                let customRecordSearch = search.create({
                    type: 'customrecord_jj_employee_commisiion',
                    filters: ['name', 'is', salesRepNameValue],
                    columns: ['internalid', 'name', 'custrecord_jj_commission_percent']
                });

                let searchResult = customRecordSearch.run().getRange({
                    start: 0,
                    end: 1
                });
                
                log.debug('Search Length: '+searchResult.length);
                if(searchResult.length > 0)
                {
                    customRecordSearch.run().each(function(result){
                    let name = result.getValue('name');
                    let id = result.getValue('internalid');

                    log.debug('Record Sales Rep: '+name);
                    log.debug('Form Sales Rep: '+salesRepNameValue);

                    if(salesRepNameValue === name)
                    {
                        let commissionReport = record.load({
                            type: 'customrecord_jj_employee_commisiion',
                            id: id,
                        })

                        commissionReport.setValue({
                            fieldId: 'custrecord_jj_commission_percent',
                            value: commissionValue,
                            ignoreFieldChange: true
                        });
                        commissionReport.save();
                        log.debug({
                            title: 'Record Updated',
                            details: 'Updated Commisssion Record ID: '+id
                        }); 
                    }
                    // else
                    // {
                    //     log.debug('new Sales rep: '+salesRepNameValue);
                    //     let commissionRecord = record.create({
                    //         type: 'customrecord_jj_employee_commisiion',
                    //         isDynamic: true
                    //     });
                        
                    //     commissionRecord.setText({fieldId: 'name', text: salesRepNameValue});
                    //     commissionRecord.setText({fieldId: 'custrecord_jj_commission_percent', text: commissionValue});
                    //     log.debug('Sales Rep: '+salesRepNameValue+' Commission: '+commissionValue)
                    //     let commissionRecordId = commissionRecord.save();
                    //     log.debug({
                    //         title: 'Record Created',
                    //         details: 'Commisssion Record ID: '+commissionRecordId
                    //     });
                    // }
                    return true;
                    });
                }
                else
                {
                    let commissionRecord = record.create({
                        type: 'customrecord_jj_employee_commisiion',
                        isDynamic: true
                    });
                    
                    commissionRecord.setText({fieldId: 'name', text: salesRepNameValue});
                    commissionRecord.setText({fieldId: 'custrecord_jj_commission_percent', text: commissionValue});
                    log.debug('Sales Rep: '+salesRepNameValue+' Commission: '+commissionValue)
                    let commissionRecordId = commissionRecord.save();
                    log.debug({
                        title: 'Record Created',
                        details: 'Commisssion Record ID: '+commissionRecordId
                    });
                }
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Creating commission record',
                    details: e.stack
                });
                log.debug(e.message);
                log.debug(e.cause);   
            }
        }

        return {onRequest}

    });
 