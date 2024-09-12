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
                label: 'Sales Order Filter'
            });

            form.addResetButton({
                label: 'Reset'
            });

            form.addSubmitButton({
                label: 'Save'
            });

            let customerFilter = form.addField({
                id: 'cust_jj_cust_filter',
                label: 'Customer Name',
                type: serverWidget.FieldType.SELECT,
                container: 'cust_jj_user_info'
            });

            let subsidiaryFilter = form.addField({
                id: 'cust_jj_subsidiary_filter',
                label: 'Subsidairy',
                type: serverWidget.FieldType.SELECT,
                container: 'cust_jj_user_info'
            });

            customerDropdownFilter(customerFilter);
            subsidiaryDropdownFilter(subsidiaryFilter);



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
                id: 'cust_jj_line_number',
                label: 'Line Number',
                type: serverWidget.FieldType.TEXT
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
                id: 'cust_jj_status',
                label: 'Status',
                type: serverWidget.FieldType.TEXT
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

            searchList.addField({
                id: 'cust_jj_department',
                label: 'Department',
                type: serverWidget.FieldType.TEXT
            });

            
            searchList.addField({
                id: 'cust_jj_line_subtotal',
                label: 'Subtotal',
                type: serverWidget.FieldType.TEXT
            });

            searchList.addField({
                id: 'cust_jj_line_tax',
                label: 'Tax',
                type: serverWidget.FieldType.TEXT
            });

            searchList.addField({
                id: 'cust_jj_line_total',
                label: 'Total',
                type: serverWidget.FieldType.TEXT
            });
            return searchList;
        }

        function customerDropdownFilter(customerFilterField)
        {
            customerFilterField.addSelectOption({
                value: ' ',
                text: 'Select Customer'
            });

            let customerSavedSearch = search.create({
                type: search.Type.CUSTOMER,
                columns: ['entityid']
            });

            customerSavedSearch.run().each(function(result)
            {
                customerFilterField.addSelectOption({
                    value: result.id,
                    text: result.getValue('entityid')
                });
                return true;
            });
        }

        function subsidiaryDropdownFilter(subsidiaryFilterField)
        {
            subsidiaryFilterField.addSelectOption({
                value: ' ',
                text: 'Select Subsidiary'
            });

            let subsidairySavedSearch = search.create({
                type: search.Type.SUBSIDIARY,
                columns: ['name']
            });

            subsidairySavedSearch.run().each(function(result)
            {
                subsidiaryFilterField.addSelectOption({
                    value: result.id,
                    text: result.getValue('name')
                });
                return true;
            });
        }

        function salesOrderSearch()
        {
            let filters =m 
            let salesOrderSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters: [['mainline', 'is', 'T'], 'and', ['status','anyof',['SalesOrd:B', 'SalesOrd:D', 'SalesOrd:E', 'SalesOrd:F']]],
                columns: ['tranid', 'trandate', 'status', 'entity', 'subsidiary', 'department',  'total'],
                title: 'Sales Order Pending Search JJ',
                id: 'customsearch_jj_sales_order_pending_sear',
                isPublic: true
            });
            // 'subtotal', 'taxtotal',
            
            let searchResult = salesOrderSearch.run();
            salesOrderSearch.save();
            let searchNumber = searchResult.length;
            log.debug({
                title: 'Search Result',
                details: 'Number of sales order is '+searchNumber
            });
            
        }

        function loadSearchResult(searchList)
        {

            let filters = [['mainline', 'is', 'T'], 'and', ['status','anyof',['SalesOrd:B', 'SalesOrd:D', 'SalesOrd:E', 'SalesOrd:F']]];
            let subsidiary = scriptContext.request.parameters
            let salesOrderSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters: filters,
                columns: ['tranid', 'trandate', 'status', 'entity', 'subsidiary', 'department',  'total'],
                title: 'Sales Order Pending Search JJ',
                id: 'customsearch_jj_sales_order_pending_sear',
                isPublic: true
            });
            // let myResult = search.load({
            //     id: 'customsearch_jj_sales_order_pending_sear'
            // });
            let searchNumber = salesOrderSearch.length;
            log.debug({
                title: 'Search Result',
                details: 'Number of sales order is '+searchNumber
            });

            let lineCounter = 0;
            let lineNumner = 1;
            salesOrderSearch.run().each(function(result){
                let id = result.id;
                let documentNumber = result.getValue({
                    name: 'tranid'
                });

                let orderDate = result.getValue({
                    name: 'trandate'
                }); 

                let status = result.getText({
                    name: 'status'
                }); 

                let customerName = result.getText({
                    name: 'entity' 
                }); 

                let subsidairy = result.getText({
                    name: 'subsidiary'
                }); 

                let department = result.getText({
                    name: 'department'
                }); 

                if (!department)
                    department = ' '

                let subtotal = result.getValue({
                    name: 'subtotal'
                });

                if (!subtotal)
                    subtotal = ' '

                let tax = result.getValue({
                    name: 'taxtotal'
                });

                if (!tax)
                    tax = ' '

                let amount = result.getValue({
                    name: 'total'
                });
                
                searchList.setSublistValue({
                    sublistId: 'cust_jj_sublist',
                    id: 'cust_jj_line_number',
                    line: lineCounter,
                    value: lineNumner
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
                    id: 'cust_jj_date',
                    line: lineCounter,
                    value: orderDate
                });

                searchList.setSublistValue({
                    sublistId: 'cust_jj_sublist',
                    id: 'cust_jj_status',
                    line: lineCounter,
                    value: status || " "
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

                searchList.setSublistValue({
                    sublistId: 'cust_jj_sublist',
                    id: 'cust_jj_department',
                    line: lineCounter,
                    value: department
                });

                searchList.setSublistValue({
                    sublistId: 'cust_jj_sublist',
                    id: 'cust_jj_line_subtotal',
                    line: lineCounter,
                    value: amount-tax
                });

                searchList.setSublistValue({
                    sublistId: 'cust_jj_sublist',
                    id: 'cust_jj_line_tax',
                    line: lineCounter,
                    value: tax
                });

                searchList.setSublistValue({
                    sublistId: 'cust_jj_sublist',
                    id: 'cust_jj_line_total',
                    line: lineCounter,
                    value: amount
                });
                
                lineCounter++;
                lineNumner++;
                return true;
            })
        }


        return {onRequest}

    });
