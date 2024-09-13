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


        function createCommisionCalculatorForm(scriptContext)
        {
            try
            {
                let form = serverWidget.createForm({
                    title: 'Employee Commission Calculator'
                });

                let salesRepFilter = form.addField({
                    id: 'cust_jj_salesrep_filter',
                    label: 'Select Sales Rep',
                    type: serverWidget.FieldType.SELECT,
                    //source: o
                });

                let commission = form.addField({
                    id: 'cust_jj_commission',
                    label: 'Commission Amount',
                    type: serverWidget.FieldType.TEXT
                });
                //salesRepDropdownFilter(salesRepFilter);

                form.addSubmitButton({
                    label: 'Submit'
                });

                scriptContext.response.writePage(form);
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in creating form',
                    details: e.stack
                });
            }
        }

        function salesRepDropdownFilter(salesRep)
        {
            salesRep.addSelectOption({
                value: ' ',
                text: 'Select Sales Rep'
            });

            let salesRepSavedSearch = search.create({
                type: search.Type.EMPLOYEE,
                filters: [['isinactive', 'is', 'F'], 'and', ['salesrep', 'is', 'T']],
                
                columns: ['entityid'],
                title: 'Sales Rep Active',
                id: 'customsearch_jj_active_salesrep'
            });

            salesRepSavedSearch.run().each(function(result)
            {
                salesRep.addSelectOption({
                    value: result.id,
                    text: result.getValue('entityid')
                });
                return true;
            });
          
        }

        function createCommissionRecord(scriptContext)
        {
            try
            {
                let request = scriptContext.request;
                let salesRepname = request.parameters.cust_jj_salesrep_filter;
                let commission = request.parameters.cust_jj_commission;
                //searchExistingCommissionRecord(salesRepname);
                
                let commissionRecord = record.create({
                    type: 'customrecord_jj_employee_commisiion',
                    isDynamic: true
                });

                commissionRecord.setValue({fieldId: 'name',value: salesRepname});
                commissionRecord.setValue({fieldId: 'custrecord_jj_commission_percent',value: commission});

                let commissionRecordId = commissionRecord.save();
                    log.debug({
                        title: 'Commission Record Created',
                        details: 'Record ID: '+commissionRecordId
                    });
                    return commissionRecordId;
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in saving record',
                    details: e.stack
                });
            }
        }

        function searchExistingCommissionRecord(salesRep)
        {
            try
            {
                let commissionrecordSearch =search.create({
                    type: 'customrecord_jj_employee_commisiion',
                    filters: [''],
                    columns:[],
                    title: string,
                    id: string,
                    isPublic: boolean
                })
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in searching commission record',
                    details: e.stack
                });
            }
        }

        function createSalesRepSearch()
        {
            try
            {
                let salesRepSearch = search.create({
                    type: search.Type.INVOICE,
                    filters: [['mainline','is','T'], 'and', ['status','anyof', ['CustInvc:B']]],
                    columns: [  search.createColumn({ name: 'salesrep', summary: search.Summary.GROUP}),
                                search.createColumn({ name: 'total', summary: search.Summary.SUM})],
                    title: 'Sales Rep Invoice Search JJ',
                    id: 'customsearch_jj_invoice_salesrep'
                })
                salesRepSearch.run().each(function(result){
                    let salesRep = result.getText({
                        name: 'salesrep'
                    });
                    let amount = result.getText({
                        name: 'total'
                    });
                    log.debug('Sales Rep: '+salesRep+'  Amount: '+amount)
                    return true;

                });
                
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in creating search',
                    details: e.stack
                });
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

                if(scriptContext.request.method === 'GET')
                {
                    createCommisionCalculatorForm(scriptContext);
                    log.debug('Commission Details Entered');                   
                    //form.clientScriptModulePath = 'SuiteScripts/JobinAndJismi/OTP-7524-SuiteScript_Training/Assessment/13-09-24/jj_cs_onam.js';  
                }
                else if(scriptContext.request.method === 'POST')
                {
                    let recId = createCommissionRecord(scriptContext);
                    log.debug({
                        title: 'Commission Record Saved',
                        details: 'ID: '+recId
                    });
                }   
            }
            catch(e)
            {
                log.debug({
                    title: 'Error in Executing',
                    details: e.stack
                });
            }

        }

        

        

        return {onRequest}

    });
