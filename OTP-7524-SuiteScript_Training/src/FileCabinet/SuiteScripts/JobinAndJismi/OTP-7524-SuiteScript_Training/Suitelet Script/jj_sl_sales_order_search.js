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

            log.debug({
                title: 'Response',
                details: scriptContext.request.method
            });

            let form = serverWidget.createForm({
                title: 'Sales Order List'
            });

            let list=addFormElements(form);
            //salesOrderSearch();
            loadSearchResult(list)
            
            scriptContext.response.writePage(form);
        }

        function addFormElements(form)
        {
            form.addFieldGroup({
                id: 'cust_jj_user_info',
                label: 'Sales Order Information'
            });

            form.addResetButton({
                label: 'Reset'
            });

            form.addSubmitButton({
                label: 'Save'
            });

            let searchList = form.addSublist({
                id: 'cust_jj_sublist',
                label: 'Sales Orders',
                type: serverWidget.SublistType.LIST
            });

            searchList.addMarkAllButtons();
            searchList.addField({
                id: 'cust_jj_checkbox',
                label: 'Select',
                type: serverWidget.FieldType.CHECKBOX
            });

            searchList.addField({
                id: 'cust_jj_internalid',
                label: 'Internal ID',
                type: serverWidget.FieldType.TEXT
            });

            searchList.addField({
                id: 'cust_jj_docnum',
                label: 'Document Number',
                type: serverWidget.FieldType.TEXT
            });

            searchList.addField({
                id: 'cust_jj_date',
                label: 'Order Date',
                type: serverWidget.FieldType.DATE
            });

            searchList.addField({
                id: 'cust_jj_custname',
                label: 'Customer Name',
                type: serverWidget.FieldType.TEXT
            });

            searchList.addField({
                id: 'cust_jj_subsidiary',
                label: 'Subsidiary',
                type: serverWidget.FieldType.TEXT
            });
            return searchList;
        }

        function salesOrderSearch()
        {
            let salesOrderSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters: ['mainline', 'is', 'T'],
                columns: ['tranid', 'entity', 'subsidiary', 'trandate'],
                title: 'Sales Order Search JJ',
                id: 'customsearch_jj_sales_order_search',
                isPublic: true
            });

            let searchResult = salesOrderSearch.run().getRange({
                start: 0,
                end: 100
            });

            let searchNumber = searchResult.length;
            log.debug({
                title: 'Search Result',
                details: 'Number of sales order is '+searchNumber
            });
            salesOrderSearch.save();
        }

        function loadSearchResult(searchList)
        {
            let myResult = search.load({
                id: 'customsearch_jj_sales_order_search'
            });

            let lineCounter = 0;
            myResult.run().each(function(result){
                let id = result.id;
                let documentNumber = result.getValue({
                    name: 'tranid'
                });

                let orderDate = result.getValue({
                    name: 'trandate'
                }); 

                let customerName = result.getText({
                    name: 'entity'
                }); 

                let subsidairy = result.getText({
                    name: 'subsidiary'
                }); 
                
                searchList.setSublistValue({
                    sublistId: 'cust_jj_sublist',
                    id: 'cust_jj_internalid',
                    line: lineCounter,
                    value: id
                });

                searchList.setSublistValue({
                    sublistId: 'cust_jj_sublist',
                    id: 'cust_jj_docnum',
                    line: lineCounter,
                    value: documentNumber
                });
                
                searchList.setSublistValue({
                    sublistId: 'cust_jj_sublist',
                    id: 'cust_jj_docnum',
                    line: lineCounter,
                    value: documentNumber
                });

                searchList.setSublistValue({
                    sublistId: 'cust_jj_sublist',
                    id: 'cust_jj_date',
                    line: lineCounter,
                    value: orderDate
                });

                searchList.setSublistValue({
                    sublistId: 'cust_jj_sublist',
                    id: 'cust_jj_custname',
                    line: lineCounter,
                    value: customerName
                });

                searchList.setSublistValue({
                    sublistId: 'cust_jj_sublist',
                    id: 'cust_jj_subsidiary',
                    line: lineCounter,
                    value: subsidairy
                });

                lineCounter++;
                return true;
            })
        }

        return {onRequest}

    });
