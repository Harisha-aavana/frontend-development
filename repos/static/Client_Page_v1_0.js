// const upload = require("../../upload")
// var jsPDF = require('jspdf');
// require('jspdf-autotable');

const { jsPDF } = window.jspdf;

// var dataArray = [["UID","Entity Name","Location Code","Type of License","State","District","Locality","Assigned Date","Document Status", "Comment","",""],
// ["123","Bharti Private Limited","PO-12124","Water OC","Karnataka","Bangalore","Gokul Road","19/06/2023","Pending","","",""],
// ["456","ABC Private Limited","PO-12134245","Air OC","Karnataka","Mangalore","HE Road","19/07/2023","Pending","","",""],
// ]

// var optionsList = ["License","Applied Copy","Receipt Copy","Challan","Acknowledgement","License cum Receipt","Bank Charges","Acknowledgement and Receipt","Others"]
// var fileTypeList = [[1,"License"],[2,"Applied Copy"],[3,"Receipt Copy"],[4,"Challan"],[5,"Acknowledgement"],[6,"License cum Receipt"],[7,"Bank Charges"],[8,"Acknowledgement and Receipt"],[9,"Others"]]

// var optionsList=[];
var columnsToHide = {"Locality":6,"Project_ID":7} ;
var columnsIndexToHide = [6,7] ;
var assignedDateColumn = 8;


$(document).ready(function(){
    uploadFileObject={"draw":1,"start":0}
    $.ajax({
        type: "POST",
        url: "/aavana_home",
        data: uploadFileObject,
        dataType: 'json',
        success: function(res){
            dataArray = res["dataArray"]
            // console.log(dataArray)
            populateTable(dataArray)
            var headerList=[]
            for(let i=1;i<(dataArray[0].length);i++)
            {
                headerList.push(dataArray[0][i])
            }
            populateNavigationPan(headerList)
            $('#dateModal').on('shown.bs.modal', function () {
                $("input[name='data-range-input']").daterangepicker({
                    singleDatePicker: true,
                    showDropdowns: true,
                    dateFormat: 'yyyy-mm-dd'
                });

            });

            $('#dateLicenseModal').on('shown.bs.modal', function () {
                $("input[name='data-range-input']").daterangepicker({
                    singleDatePicker: true,
                    showDropdowns: true,
                    dateFormat: 'yyyy-mm-dd'
                });

            });


            mainSearchBar()
            updateCountdown()
            updateCountdown2()

            $.ajax({
                type:'GET',
                url:"/file_type",
                success: function(res){
                    var fileTypeList = Object.entries(res);
                    optionsList = Object.values(res);

                    const Upload_File_button_nodeList = document.querySelectorAll('[id^="Upload-Files-Button-Row"]');
                    for(let i=0;i<Upload_File_button_nodeList.length;i++)
                    {

                        Upload_File_button_nodeList[i].addEventListener('click', function handleClick() {
                            var task_id = (Upload_File_button_nodeList[i].getAttribute("data-uid")).toString();
                            document.getElementById('Dashboard-Modal-Table-Body-Row').innerHTML='';
                            populateUploadFilesPage(fileTypeList,optionsList,Upload_File_button_nodeList[i].getAttribute('data-uid'),Upload_File_button_nodeList[i].getAttribute('data-pid'))
                            $.ajax({
                                type:"POST",
                                url:"/getUploadedDocument",
                                data:{"task_id":task_id},
                                dataType:'json',
                                success: function(uploadedDocumentList){
                                    // console.log("here")
                                    
                                    for(let j=0;j<uploadedDocumentList.length;j++)
                                    {
                                        // console.log(uploadedDocumentList[j])
                                        var optionsList = uploadedDocumentList[j]["Category_type"]
                                        var argv = uploadedDocumentList[j]["task_id"] ;
                                        var pid = uploadedDocumentList[j]["project_id"] ;
                                        var i = parseInt(uploadedDocumentList[j]["category_id"])-1 ;
                                        var file_id = uploadedDocumentList[j]["file_id"] ;
                                        var document_id = uploadedDocumentList[j]["doc_id"] ;
                                        var filename = uploadedDocumentList[j]["file_name"] ;

                                        var tableBody = document.getElementById('Dashboard-Modal-Table-Body-Row');

                                        var tr_element = document.createElement('tr');
                                        var HTML_content = `<td><div class="form-check"><input class="form-check-input" data-pid="`+pid+`" data-uid="`+argv+`" file_id='`+(i+1)+`' type="checkbox" name="categoryCheckBox" value="`+optionsList+`" id="flexCheckDefault-Row-`+(i+1)+`" onchange="if(document.getElementById('Upload-Files-Modal-Button-Row-`+(i+1)+`-`+argv+`').disabled==true){document.getElementById('Upload-Files-Modal-Button-Row-`+(i+1)+`-`+argv+`').disabled=false} else {document.getElementById('Upload-Files-Modal-Button-Row-`+(i+1)+`-`+argv+`').disabled=true}" checked><label class="form-check-label" for="flexCheckDefault-Row-`+(i+1)+`"></label></div></td>
                                        <td file_id='`+(i+1)+`' id="category_sno_`+(i+1)+`">`+optionsList+`</td>
                                        <td><form id="Upload-Form-Modal-Input-Row"><input type='file' name='file' data-pid="`+pid+`" data-uid="`+argv+`" id="Upload-Files-Modal-Input-Row-`+(i+1)+`-`+argv+`" name='documentUpload' onchange="addFileUploadList('`+i+`','`+argv+`','`+pid+`','Upload-Files-Modal-Input-Row-`+(i+1)+`-`+argv+`')" style="display: none;"><button type="button" class="btn btn-primary" style="font-size:12px; margin-top:-5px" id="Upload-Files-Modal-Button-Row-`+(i+1)+`-`+argv+`" onclick="document.getElementById('Upload-Files-Modal-Input-Row-`+(i+1)+`-`+argv+`').click()">Upload</button></input></form></td>
                                        <td id="Uploaded-File-Name-Row-`+(i+1)+`">`+filename+`</td>
                                        <td><button id="Uploaded-File-Delete-Row-`+(i+1)+`" class="btn" style="margin-top: -10px;" onclick="deleteFileEntry(`+document_id+`,inner_tablebody_tr_`+argv+`_`+file_id+`)"><i class="fa fa-trash" aria-hidden="true" style="color:#940d12"></i></button></td>`

                                        var modal_tr_id_attr = document.createAttribute('id')
                                        modal_tr_id_attr.value = "inner_tablebody_tr_"+argv+"_"+(i+1);
                                        tr_element.setAttributeNode(modal_tr_id_attr)


                                        tr_element.innerHTML=HTML_content;
                                        tableBody.appendChild(tr_element)
                                        var category_sno = parseInt(i)+1

                                        document.getElementById(pid+"-"+argv+"-"+category_sno).checked=true;
                                        document.getElementById(pid+"-"+argv+"-"+category_sno).disabled=true;

                                    }
                                }

                            })

                            

                        });
                    }
                }
            })
        }
    });

})


function populateTable(dataArray)
{

    var tableHead = document.getElementById('Dashboard-Data-Table-Header-Row');
    var tableBody = document.getElementById('Dashboard-Data-Table-Body-Row');

    for(let i=0;i<dataArray.length;i++)
    {
        // console.log("Here !!!!")
        var tr_element = document.createElement('tr');

        var button_element = document.createElement('a');
        button_element.classList.add("Upload-Files-Button")
        var button_toggle_attr = document.createAttribute('href')
        button_toggle_attr.value="#"
        var button_toggle_attr = document.createAttribute('data-bs-toggle')
        button_toggle_attr.value="modal"
        var button_target_attr = document.createAttribute('data-bs-target')
        button_target_attr.value="#myModal"
        var button_id_attr = document.createAttribute('id')
        button_id_attr.value = "Upload-Files-Button-Row-"+(i)  // Here we are not doing i+1, because first row i.e. 0 will be the header. Thus, we will start from index 1 and hence it will be Row 1
        var button_uid_attr = document.createAttribute('data-UID')
        var button_pid_attr = document.createAttribute('data-PID')


        button_element.setAttributeNode(button_toggle_attr)
        button_element.setAttributeNode(button_target_attr)
        button_element.setAttributeNode(button_id_attr)

        button_element.innerText="Document Type"


        if(i==0)
        {
            var th_element = document.createElement('th');
            th_element.innerText="";
            var th_style_attr = document.createAttribute('style')
            th_style_attr.value="width:6%"
            th_element.setAttributeNode(th_style_attr)
            tr_element.appendChild(th_element)
        }

        else
        {
            // console.log(i)
            // console.log(dataArray[i])
            var td_element = document.createElement('td');
            button_uid_attr.value=dataArray[i][0]
            button_element.setAttributeNode(button_uid_attr)
            button_pid_attr.value=dataArray[i][7]
            button_element.setAttributeNode(button_pid_attr)
            button_element.innerHTML='<i class="fa-solid fa-file" title="Add Documents" style="cursor:pointer;font-size:20px;margin-left:20px;"></i>'
            td_element.appendChild(button_element)

            var anchor_element_2 = document.createElement('a');
            anchor_element_2.classList.add("Edit-Comment-Button")
            var anchor_toggle_attr_2 = document.createAttribute('href')
            anchor_toggle_attr_2.value="#"
            var anchor_toggle_attr_2 = document.createAttribute('data-bs-toggle')
            anchor_toggle_attr_2.value="modal"
            var anchor_target_attr_2 = document.createAttribute('data-bs-target')
            anchor_target_attr_2.value="#EditModal"
            var anchor_id_attr_2 = document.createAttribute('id')
            anchor_id_attr_2.value = "Edit-Comment-Button-Row-"+(i)  // Here we are not doing i+1, because first row i.e. 0 will be the header. Thus, we will start from index 1 and hence it will be Row 1
            var anchor_uid_attr_2 = document.createAttribute('data-UID')


            anchor_element_2.setAttributeNode(anchor_toggle_attr_2)
            anchor_element_2.setAttributeNode(anchor_target_attr_2)
            anchor_element_2.setAttributeNode(anchor_id_attr_2)

            anchor_uid_attr_2.value=dataArray[i][0]
            anchor_element_2.setAttributeNode(anchor_uid_attr_2)

            var anchor_target_attr_2 = document.createAttribute('onclick')
            anchor_target_attr_2.value="openEditCommentModal('"+dataArray[i][0]+"',"+i+")"
            anchor_element_2.setAttributeNode(anchor_target_attr_2)

            anchor_element_2.innerHTML='<i class="fa-sharp fa-solid fa-pen-to-square" title="Edit Comments" style="cursor:pointer;font-size:18px;margin-left:20px;"></i>'


            td_element.appendChild(anchor_element_2)

            tr_element.appendChild(td_element)

        }

        for(let j=1;j<dataArray[i].length;j++)
        {
            if(i==0)
            {
                //Get the header list from the first row of this dataArray
                var th_element = document.createElement('th');
                th_element.innerText=dataArray[i][j];
                if(columnsIndexToHide.includes(j))
                {

                    var th_style_attr = document.createAttribute('style')
                    th_style_attr.value = "display:none"
                    th_element.setAttributeNode(th_style_attr)

                    var th_id_attr = document.createAttribute('class')
                    th_id_attr.value = "Main-Data-Table-Column-"+(j+1)
                    th_element.setAttributeNode(th_id_attr)
                }
                tr_element.appendChild(th_element)

            }

            else
            {
                //Get the data from second row onwards of this dataArray
                var td_element = document.createElement('td');
                td_element.innerText=dataArray[i][j];
                if(j==1)
                {
                    var td_id_attr = document.createAttribute('id')
                    td_id_attr.value = "tablebody_td_"+dataArray[i][0]
                    td_element.setAttributeNode(td_id_attr)
                }
                if(columnsIndexToHide.includes(j))
                {

                    var td_style_attr = document.createAttribute('style')
                    td_style_attr.value = "display:none"
                    td_element.setAttributeNode(td_style_attr)

                    var td_id_attr = document.createAttribute('class')
                    td_id_attr.value = "Main-Data-Table-Column-"+(j+1)
                    td_element.setAttributeNode(td_id_attr)
                }

                tr_element.appendChild(td_element)
                var tr_id_attr = document.createAttribute('id')
                tr_id_attr.value = "tablebody_tr_"+dataArray[i][0]
                tr_element.setAttributeNode(tr_id_attr)


            }
        }

        if(i==0)
        {
            tableHead.appendChild(tr_element)
        }

        else
        {
            tableBody.appendChild(tr_element)
        }
    }

    $("#Main-Data-Table-Content").DataTable({
        searching: false,
        ordering:true,
        dom: "fltip",
        // rowReorder: true,
        // columnDefs: [
        //     { orderable: true, className: 'reorder', type: 'custom-date', targets: 8 },
        //     { orderable: false, targets: '_all' }
        // ]

    });

    var showColumnsDropdownElement = document.getElementById("Dashboard-Show-Columns-Dropdown_List")
    showColumnsDropdownElement.addEventListener('change', function(){

        var checkboxes = document.querySelectorAll("#Dashboard-Show-Columns-Dropdown_List .form-check-input");

        // Starting from index, because "Basic Columns" will be by-default checked all the time and it will be at index 0
        for (var i = 1; i < checkboxes.length; i++)
        {
            var selectedColumn = checkboxes[i].value;
            var indexforColumn = columnsToHide[selectedColumn]

            var elementColumnsList = document.getElementsByClassName("Main-Data-Table-Column-"+(indexforColumn+1))
            for(let j=0;j<elementColumnsList.length;j++)
            {
                var elementColumns = elementColumnsList[j]

                if (elementColumns.style.display === "none") {
                    elementColumns.style.display = null;
                } else {
                    elementColumns.style.display = "none";
                }
            }


            var sideNavColumnsList = document.getElementById("sideColumnSearchBar-"+(indexforColumn))

            if (sideNavColumnsList.style.display === "none") {
                sideNavColumnsList.style.display = null;
            } else {
                sideNavColumnsList.style.display = "none";
            }



        }


    })
}

function populateNavigationPan(headerList)
{
    var sideBar = document.getElementById('Main-Column-Search-Box');
    for(let i=0;i<headerList.length;i++)
    {
        var HTML_content="";
        if(headerList[i] == "Assigned Date")
        {

            if(columnsIndexToHide.includes(i+1))
            {
                HTML_content = `<div class="row sideColumnSearchBar" id="sideColumnSearchBar-`+(i+1)+`" style="display:none;margin-top: 20px;">
                    <div class="col-md-12">
                        <div class="row"><div class="col-md-12"><span style="color: white;font-size:15px">`+headerList[i]+`</span></div></div>
                        <div class="row"><input data-bs-toggle="modal" data-bs-target="#dateModal" id="`+(i+1)+`" class="sideSearchInput date-range-input" type="text" placeholder="Search for `+headerList[i]+`" spellcheck="false" style="font-size:12px;color:#828282; padding-top:5px; padding-bottom:5px;font-family:'bentonsans-regular',sans-serif; width:80%;margin-left: 10px;"></div>
                    </div>
                </div>`
            }


            else
            {
                HTML_content = `<div class="row sideColumnSearchBar" style="margin-top: 20px;">
                    <div class="col-md-12">
                        <div class="row"><div class="col-md-12"><span style="color: white;font-size:15px">`+headerList[i]+`</span></div></div>
                        <div class="row"><input data-bs-toggle="modal" data-bs-target="#dateModal" id="`+(i+1)+`" class="sideSearchInput date-range-input" type="text" placeholder="Search for `+headerList[i]+`" spellcheck="false" style="font-size:12px;color:#828282;padding-top:5px; padding-bottom:5px; font-family:'bentonsans-regular',sans-serif; width:80%;margin-left: 10px;"></div>
                    </div>
                </div>`
            }

        }

        else if(headerList[i]=="License Expiry Date")
        {
            if(columnsIndexToHide.includes(i+1))
            {
                HTML_content = `<div class="row sideColumnSearchBar" id="sideColumnSearchBar-`+(i+1)+`" style="display:none;margin-top: 20px;">
                    <div class="col-md-12">
                        <div class="row"><div class="col-md-12"><span style="color: white;font-size:15px">`+headerList[i]+`</span></div></div>
                        <div class="row"><input data-bs-toggle="modal" data-bs-target="#dateLicenseModal" id="`+(i+1)+`" class="sideSearchInput date-range-input" type="text" placeholder="Search for `+headerList[i]+`" spellcheck="false" style="font-size:12px;color:#828282; padding-top:5px; padding-bottom:5px;font-family:'bentonsans-regular',sans-serif; width:80%;margin-left: 10px;"></div>
                    </div>
                </div>`
            }


            else
            {
                HTML_content = `<div class="row sideColumnSearchBar" style="margin-top: 20px;">
                    <div class="col-md-12">
                        <div class="row"><div class="col-md-12"><span style="color: white;font-size:15px">`+headerList[i]+`</span></div></div>
                        <div class="row"><input data-bs-toggle="modal" data-bs-target="#dateLicenseModal" id="`+(i+1)+`" class="sideSearchInput date-range-input" type="text" placeholder="Search for `+headerList[i]+`" spellcheck="false" style="font-size:12px;color:#828282;padding-top:5px; padding-bottom:5px; font-family:'bentonsans-regular',sans-serif; width:80%;margin-left: 10px;"></div>
                    </div>
                </div>`
            }
        }

        else if(columnsIndexToHide.includes(i+1))
        {
            HTML_content = `<div class="row sideColumnSearchBar" id="sideColumnSearchBar-`+(i+1)+`" style="display:none;margin-top: 20px;">
                <div class="col-md-12">
                    <div class="row"><div class="col-md-12"><span style="color: white;font-size:15px">`+headerList[i]+`</span></div></div>
                    <div class="row"><input id="`+(i+1)+`" class="sideSearchInput" type="search" placeholder="Search for `+headerList[i]+`" spellcheck="false" style="font-size:12px;color:#828282; padding-top:5px; padding-bottom:5px;font-family:'bentonsans-regular',sans-serif; width:80%;margin-left: 10px;"></div>
                </div>
            </div>`
        }

        else
        {
            HTML_content = `<div class="row sideColumnSearchBar" style="margin-top: 20px;">
                <div class="col-md-12">
                    <div class="row"><div class="col-md-12"><span style="color: white;font-size:15px">`+headerList[i]+`</span></div></div>
                    <div class="row"><input id="`+(i+1)+`" class="sideSearchInput" type="search" placeholder="Search for `+headerList[i]+`" spellcheck="false" style="font-size:12px;color:#828282;padding-top:5px; padding-bottom:5px; font-family:'bentonsans-regular',sans-serif; width:80%;margin-left: 10px;"></div>
                </div>
            </div>`
        }

        sideBar.innerHTML+=HTML_content

    }

    var searchBarNodeList = document.querySelectorAll("#Main-Column-Search-Box input")
    for(let i=0;i<searchBarNodeList.length;i++)
    {
        var col = searchBarNodeList[i].id;
        columnLevelSearchBar(searchBarNodeList[i],col,headerList[i])

    }
}

function populateUploadFilesPage(fileTypeList,optionsList,argv,pid)
{
    var dropdownMenu = document.getElementById('MultiSelect-Dropdown-Menu');
    var HTML_content="";
    dropdownMenu.innerHTML="<input id='categorySearch' type='search' placeholder='Search' spellcheck=false onkeyup='categorySearch()' style='margin-bottom:20px; margin-left:25px;'>"
    for(let i=0;i<fileTypeList.length;i++)
    {
        HTML_content += `<div class="form-check" style="margin-left:10px;font-size:13px;padding-right:20px;">
        <input type="checkbox" name="dropdownCheckBox" value="`+fileTypeList[i][1]+`" class="form-check-input" id="`+pid+`-`+argv+`-`+(fileTypeList[i][0])+`">
        <label class="form-check-label" for="`+(fileTypeList[i][0]+1)+`">`+fileTypeList[i][1]+`</label>
    </div>`
    }

    dropdownMenu.innerHTML+=HTML_content;

    var tableBody = document.getElementById('Dashboard-Modal-Table-Body-Row');
    tableBody.innerHTML= tableBody.innerHTML;

    var dropdownListNodes  = document.querySelectorAll("#MultiSelect-Dropdown-Menu .form-check .form-check-input")
    for(let i=0;i<dropdownListNodes.length;i++)
    {
        dropdownListNodes[i].addEventListener("change",function(){
            var UID_Row = (dropdownListNodes[i].id).split("-")
            var PID_key = UID_Row[0]
            var UID_key=UID_Row[1]
            var Row_Key=parseInt(UID_Row[2])-1

            if(dropdownListNodes[i].checked)
            {
                addCategories(dropdownListNodes[i].value,Row_Key,UID_key,PID_key,1)
            }

            else
            {
                addCategories(dropdownListNodes[i].value,Row_Key,UID_key,PID_key,0)

            }
        })
    }

}

function addCategories(optionsList,i,argv,pid,add)
{

    var tableBody = document.getElementById('Dashboard-Modal-Table-Body-Row');

    var tr_element = document.createElement('tr');
    var HTML_content = `<td><div class="form-check"><input class="form-check-input" data-pid="`+pid+`" data-uid="`+argv+`" file_id='`+(i+1)+`' type="checkbox" name="categoryCheckBox" value="`+optionsList+`" id="flexCheckDefault-Row-`+(i+1)+`" onchange="if(document.getElementById('Upload-Files-Modal-Button-Row-`+(i+1)+`-`+argv+`').disabled==true){document.getElementById('Upload-Files-Modal-Button-Row-`+(i+1)+`-`+argv+`').disabled=false} else {document.getElementById('Upload-Files-Modal-Button-Row-`+(i+1)+`-`+argv+`').disabled=true}" checked><label class="form-check-label" for="flexCheckDefault-Row-`+(i+1)+`"></label></div></td>
    <td file_id='`+(i+1)+`' id="category_sno_`+(i+1)+`">`+optionsList+`</td>
    <td><form id="Upload-Form-Modal-Input-Row"><input type='file' name='file' data-pid="`+pid+`" data-uid="`+argv+`" id="Upload-Files-Modal-Input-Row-`+(i+1)+`-`+argv+`" name='documentUpload' onchange="addFileUploadList('`+i+`','`+argv+`','`+pid+`','Upload-Files-Modal-Input-Row-`+(i+1)+`-`+argv+`')" style="display: none;"><button type="button" class="btn btn-primary" style="font-size:12px; margin-top:-5px" id="Upload-Files-Modal-Button-Row-`+(i+1)+`-`+argv+`" onclick="document.getElementById('Upload-Files-Modal-Input-Row-`+(i+1)+`-`+argv+`').click()">Upload</button></input></form></td>
    <td id="Uploaded-File-Name-Row-`+(i+1)+`"></td>
    <td><button id="Uploaded-File-Delete-Row-`+(i+1)+`" class="btn" style="margin-top: -10px; display:none" onclick="deleteFileEntry(0,inner_tablebody_tr_`+argv+`_`+(parseInt(i)+1)+`)"><i class="fa fa-trash" aria-hidden="true" style="color:#940d12"></i></button></td>`

    var modal_tr_id_attr = document.createAttribute('id')
    modal_tr_id_attr.value = "inner_tablebody_tr_"+argv+"_"+(i+1);
    tr_element.setAttributeNode(modal_tr_id_attr)

    if(add)
    {
        tr_element.innerHTML=HTML_content;
        tableBody.appendChild(tr_element)
    }

    else
    {
        document.getElementById("inner_tablebody_tr_"+argv+"_"+(i+1)).remove()
    }

}

function exportTableToExcel(tableID, filename = '')
{
    const table = document.getElementById(tableID);
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, 'Aavana_Product_Summary.xlsx');
}

function exportToCSV(tableID, filename = '')
{
    const table = document.getElementById(tableID);
    const ws = XLSX.utils.table_to_sheet(table);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Aavana_Product_Summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportToPDF(tableID, filename = '')
{
    const table = document.getElementById(tableID);
    const pdf = new jsPDF();
    pdf.autoTable({ html: '#'+tableID });
    pdf.save('Aavana_Product_Summary.pdf');
  }


function addFileUploadList(i,task_id,project_id,inputElement)
{
    i=parseInt(i);
    var clickedInputElement = document.getElementById(inputElement)
    var uploadedFileName = clickedInputElement.files[0].name;
    var elementNameID = "Uploaded-File-Name-Row-"+(i+1)
    var elementDeleteID = "Uploaded-File-Delete-Row-"+(i+1)
    // console.log(document.getElementById(elementDeleteID))

    document.getElementById(elementNameID).innerText = uploadedFileName
    document.getElementById(elementDeleteID).style.display=null;

    var category_sno = i+1;
    if(document.getElementById(project_id+"-"+task_id+"-"+category_sno).disabled==true)
        document.getElementById(project_id+"-"+task_id+"-"+category_sno).disabled=false;

}

function submitFileForm()
{
    var allUploadedCategories = document.querySelectorAll("#Dashboard-Modal-Table-Body-Row .form-check-input");

    for(let i=0;i<allUploadedCategories.length;i++)
    {
        if(allUploadedCategories[i].checked)
        {
            var task_id = allUploadedCategories[i].getAttribute('data-uid')  ;
            var project_id = allUploadedCategories[i].getAttribute('data-pid')  ;
            var file_id = allUploadedCategories[i].getAttribute('file_id')  ;

            var selectedFile = document.getElementById("Upload-Files-Modal-Input-Row-"+file_id+"-"+task_id).files[0];
            var file_name = document.getElementById("Uploaded-File-Name-Row-"+file_id).innerText ;

            // console.log(selectedFile)
            
            if(selectedFile)
            {

                    const formData = new FormData()
                    formData.append('file', selectedFile);
                    formData.append('task_id', task_id);
                    formData.append('project_id', project_id);
                    formData.append('file_id', file_id);

                    $.ajax({
                        type: "POST",
                        url: "/upload",
                        data: formData,
                        dataType: 'json',
                        processData: false,
                        contentType: false,
                        success: function(document_id){
                            // console.log(document_id)
                            document.getElementById("Uploaded-File-Delete-Row-"+file_id).setAttribute("onclick","deleteFileEntry("+document_id+",inner_tablebody_tr_"+task_id+"_"+file_id+";)");
                            
                        }
                    });
            }

            else
            {
                if(file_name=='')
                    alert("You haven't uploaded the file for "+allUploadedCategories[i].value+" category!")

            }

        }
    }
    location.reload();
}

function deleteFileEntry(document_id,tr_element_id)
{
    // console.log(document_id)
    // console.log(tr_element_id)
    
    if(document_id!=0)
    {
        $.ajax({
            type: "POST",
            url: "/delete_document",
            data: {"docId":document_id}, 
            dataType: 'json',
                success: function(){
                    document.getElementById(tr_element_id).remove();
                }
        });
    }

    else 
    {
        tr_element_id.remove();
    }


}

function openAddCommentModal(task_id, row_num)
{
    // console.log(task_id)
    // console.log(row_num)

    $("#commentModal").modal("show");

    document.querySelector("#commentModal .modal-body textarea").id = "addCommentTextarea-"+task_id+"-"+row_num;
    document.querySelector("#commentModal .modal-body input").id = "check-internal-external-"+task_id+"-"+row_num;
    document.querySelector("#commentModal .modal-footer button").id = "addCommentsModal-"+task_id+"-"+row_num;

    var saveChangesButton = document.querySelector("#commentModal .modal-footer button");

    var addCommentOnclick = document.createAttribute('onclick')
    addCommentOnclick.value="addComment("+task_id+","+row_num+")"
    saveChangesButton.setAttributeNode(addCommentOnclick)

}

function openEditCommentModal(task_id, row_num)
{
    
    // console.log(task_id)
    // console.log(row_num)

    $("#editModal").modal("show");

    document.querySelectorAll("#editModal .modal-body textarea")[0].id = "addCommentTextarea-"+task_id+"-"+row_num;
    document.querySelectorAll("#editModal .modal-body input")[0].id = "check-internal-external-"+task_id+"-"+row_num;
    document.querySelectorAll("#editModal .modal-body button")[0].id = "addCommentsModal-"+task_id+"-"+row_num;

    var saveAddCommentsButton = document.getElementById("addCommentsModal-"+task_id+"-"+row_num);

    var addCommentOnclick = document.createAttribute('onclick')
    addCommentOnclick.value="addComment('"+task_id+"',"+row_num+")"
    saveAddCommentsButton.setAttributeNode(addCommentOnclick)

    document.querySelectorAll("#editModal .modal-body textarea")[1].id = "editCommentTextarea-"+task_id+"-"+row_num;
    document.querySelectorAll("#editModal .modal-body input")[1].id = "edit-check-internal-external-"+task_id+"-"+row_num;
    document.querySelectorAll("#editModal .modal-body button")[1].id = "editCommentsModal-"+task_id+"-"+row_num;

    var saveEditCommentsButton = document.getElementById("editCommentsModal-"+task_id+"-"+row_num);

    var editCommentOnclick = document.createAttribute('onclick')
    editCommentOnclick.value="editComment('"+task_id+"',"+row_num+")"
    saveEditCommentsButton.setAttributeNode(editCommentOnclick)

    $.ajax({
        type: "POST",
        data: {"task_id":task_id},
        dataType: 'json',
        url: "/getCommentsHistory",
            success: function(res){
                console.log(res)
                var tableBody = document.getElementById('Comment-Modal-Table-Body-Row');
                tableBody.innerHTML='';
                if(res.length>0)
                {

                    for(let i=0;i<res.length;i++)
                    {
                        var recordEntry=res[i];
                        var tr_element = document.createElement("tr");

                        for(let j=1;j<4;j++)
                        {
                            var td_element = document.createElement("td") ;
                            td_element.innerText=recordEntry[j]
                            tr_element.appendChild(td_element) ;
                        }

                        tableBody.appendChild(tr_element);

                    }

                    document.getElementById("editCommentTextarea-"+task_id+"-"+row_num).disabled=false;
                    document.getElementById("editCommentTextarea-"+task_id+"-"+row_num).innerText=res[0][2];

                    if(res[0][3]=='external')
                    {
                        document.getElementById("edit-check-internal-external-"+task_id+"-"+row_num).disabled=false;
                        document.getElementById("edit-check-internal-external-"+task_id+"-"+row_num).click();
                    }
                }

                else
                {
                    document.getElementById("editCommentTextarea-"+task_id+"-"+row_num).innerText="";
                    document.getElementById("editCommentTextarea-"+task_id+"-"+row_num).disabled=true;
                    document.getElementById("edit-check-internal-external-"+task_id+"-"+row_num).checked=false;
                    document.getElementById("edit-check-internal-external-"+task_id+"-"+row_num).disabled=true;
                    document.getElementById("editCommentsModal-"+task_id+"-"+row_num).disabled=true;
                }
            }
        });

}

function addComment(task_id, row_num)
{
    
    // console.log("AJAX Add Comment",task_id,row_num)

    var comment = document.getElementById("addCommentTextarea-"+task_id+"-"+row_num).value;

    document.getElementById("addCommentTextarea-"+task_id+"-"+row_num).value="";

    // document.getElementById("addCommentsModal-"+task_id+"-"+row_num).disabled=true;

    var comment_type="internal"
    if(document.getElementById("check-internal-external-"+task_id+"-"+row_num).checked)
    {
        comment_type="external"
    }

    document.getElementById("check-internal-external-"+task_id+"-"+row_num).checked=false;

    var uploadCommentObj = {
        "task_id": task_id,
        "comment":comment,
        "comment_type":comment_type
    }

    // console.log(uploadCommentObj)

    $.ajax({
        type: "POST",
        url: "/add_comment",
        data: uploadCommentObj,
        dataType: 'json',
            success: function(){
                // alert("Your Comment is added successfully!")
                // location.reload();
                openEditCommentModal(task_id, row_num)
            }
    });
}

function editComment(task_id, row_num)
{
    // console.log("AJAX Edit Comment")
    var comment = document.getElementById("editCommentTextarea-"+task_id+"-"+row_num).value;

    var comment_type="internal"
    if(document.getElementById("edit-check-internal-external-"+task_id+"-"+row_num).checked)
    {
        comment_type="external"
    }

    var uploadCommentObj = {
        "task_id": task_id,
        "comment":comment,
        "comment_type":comment_type
    }

    // console.log(uploadCommentObj)

    $.ajax({
        type: "POST",
        url: "/add_comment",
        data: uploadCommentObj,
        dataType: 'json',
            success: function(){
                alert("Your Comment is edited successfully!")
                location.reload();
            }
    });
}

function mainSearchBar()
{
    var searchBar = document.getElementById("search-input");
    var dataTable = document.getElementById("Main-Data-Table-Content");

    // Add an event listener to the search bar
    searchBar.addEventListener("keyup", function() {
        var searchText = searchBar.value.toLowerCase();
        var rows = dataTable.getElementsByTagName("tr");

        // Loop through the table rows
        for (var i = 2; i < rows.length; i++) { // Start from 1 to skip the header row
            var row = rows[i];
            var cells = row.getElementsByTagName("td");
            var found = false;

            // Loop through the cells in the current row
            for (var j = 1; j < cells.length; j++) {
                var cellText = cells[j].textContent.toLowerCase();
                if (cellText.includes(searchText)) {
                    found = true;
                    break;
                }
            }

            // Show or hide the row based on whether the text was found
            if (found) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    });
}

function columnLevelSearchBar(searchBar,selectedColumn,columnName)
{
    var dataTable = document.getElementById("Main-Data-Table-Content");

    if(columnName == "Assigned Date"){
        // console.log("Here")
        var startDateDefault = document.getElementById("startDateDefault")
        startDateDefault.addEventListener("click",function(){

            if((document.getElementById("startDateDefault").checked)==false)
            {
                document.getElementById("startDateInput").disabled=false;
            }

            else
            {
                document.getElementById("startDateInput").disabled=true;
            }

        })

        var endDateDefault = document.getElementById("endDateDefault")
        endDateDefault.addEventListener("click",function(){

            if((document.getElementById("endDateDefault").checked)==false)
            {
                document.getElementById("endDateInput").disabled=false;
            }

            else
            {
                document.getElementById("endDateInput").disabled=true;
            }

        })


        $('#saveDates').on('click', function(e) {
            var startDate = $('#startDateInput').val();
            var endDate = $('#endDateInput').val();

            if(document.getElementById("startDateInput").disabled==true)
                startDate="01/01/0001"

            if(document.getElementById("endDateInput").disabled==true)
                endDate="12/31/9999"

            // Handle saving dates or performing other actions
            var startDateList = startDate.split("/")
            startDate = startDateList[2]+"-"+startDateList[0]+"-"+startDateList[1]

            var endDateList = endDate.split("/")
            endDate = endDateList[2]+"-"+endDateList[0]+"-"+endDateList[1]

            // console.log('Start Date:', startDate);
            // console.log('End Date:', endDate);

            var rows = dataTable.getElementsByTagName("tr");

            // Loop through the table rows
            for (var i = 2; i < rows.length; i++) { // Start from 1 to skip the header row
                var row = rows[i];
                var cells = row.getElementsByTagName("td");

                var cell = cells[selectedColumn];
                var cellText = cell.textContent.toLowerCase();

                var cellTextDate = cellText.split("/").reverse().join("-")

                var startD1 = Date.parse(startDate)
                var endD2 = Date.parse(endDate)
                var cellD3 = Date.parse(cellTextDate)

                // Show or hide the row based on whether the text was found

                if ((startD1<=cellD3) && (endD2>=cellD3))
                {
                    row.style.display = "";
                }
                else
                {
                    row.style.display = "none";
                }

            }

            $("#dateModal").modal('toggle');

            if(endDate=="9999-12-31" && startDate=="0001-01-01")
                document.getElementById(selectedColumn).value="All";

            else if(endDate=="9999-12-31")
                document.getElementById(selectedColumn).value=startDate+" onwards ";

            else if(startDate=="0001-01-01")
                document.getElementById(selectedColumn).value="Till "+endDate;

            else
                document.getElementById(selectedColumn).value=startDate+" To "+endDate;
        })
    }

    else if(columnName=="License Expiry Date")
    {

        // console.log("Here")
        var startLicenseDateDefault = document.getElementById("startLicenseDateDefault")
        startLicenseDateDefault.addEventListener("click",function(){

            if((document.getElementById("startLicenseDateDefault").checked)==false)
            {
                document.getElementById("startLicenseDateInput").disabled=false;
            }

            else
            {
                document.getElementById("startLicenseDateInput").disabled=true;
            }

        })

        var endLicenseDateDefault = document.getElementById("endLicenseDateDefault")
        endLicenseDateDefault.addEventListener("click",function(){

            if((document.getElementById("endLicenseDateDefault").checked)==false)
            {
                document.getElementById("endLicenseDateInput").disabled=false;
            }

            else
            {
                document.getElementById("endLicenseDateInput").disabled=true;
            }

        })


        $('#saveLicenseDates').on('click', function(e) {
            var startDate = $('#startLicenseDateInput').val();
            var endDate = $('#endLicenseDateInput').val();

            if(document.getElementById("startLicenseDateInput").disabled==true)
                startDate="01/01/0001"

            if(document.getElementById("endLicenseDateInput").disabled==true)
                endDate="12/31/9999"

            // Handle saving dates or performing other actions
            var startDateList = startDate.split("/")
            startDate = startDateList[2]+"-"+startDateList[0]+"-"+startDateList[1]

            var endDateList = endDate.split("/")
            endDate = endDateList[2]+"-"+endDateList[0]+"-"+endDateList[1]

            // Handle saving dates or performing other actions
            console.log('Start Date:', startDate);
            console.log('End Date:', endDate);

            var rows = dataTable.getElementsByTagName("tr");

            // Loop through the table rows
            for (var i = 2; i < rows.length; i++) { // Start from 1 to skip the header row
                var row = rows[i];
                var cells = row.getElementsByTagName("td");

                var cell = cells[selectedColumn];
                var cellText = cell.textContent.toLowerCase();

                var cellTextDate = cellText.split("/").reverse().join("-")

                var startD1 = Date.parse(startDate)
                var endD2 = Date.parse(endDate)
                var cellD3 = Date.parse(cellTextDate)

                // Show or hide the row based on whether the text was found

                if ((startD1<=cellD3) && (endD2>=cellD3))
                {
                    row.style.display = "";
                }
                else
                {
                    row.style.display = "none";
                }

            }

            $("#dateLicenseModal").modal('toggle');

            if(endDate=="9999-12-31" && startDate=="0001-01-01")
                document.getElementById(selectedColumn).value="All";

            else if(endDate=="9999-12-31")
                document.getElementById(selectedColumn).value=startDate+" onwards ";

            else if(startDate=="0001-01-01")
                document.getElementById(selectedColumn).value="Till "+endDate;

            else
                document.getElementById(selectedColumn).value=startDate+" To "+endDate;

          });
    }

    else
    {
        // Add an event listener to the search bar
        searchBar.addEventListener("keyup", function() {
            var searchText = searchBar.value.toLowerCase();
            var rows = dataTable.getElementsByTagName("tr");

            // Loop through the table rows
            for (var i = 2; i < rows.length; i++) { // Start from 1 to skip the header row
                var row = rows[i];
                var cells = row.getElementsByTagName("td");

                var cell = cells[selectedColumn];
                var cellText = cell.textContent.toLowerCase();

                // Show or hide the row based on whether the text was found

                if (cellText.includes(searchText))
                {
                    row.style.display = "";
                }
                else
                {
                    row.style.display = "none";
                }

            }
        });
    }

}

function calculateTimeRemaining()
{
    const currentDate = new Date();
    const targetDate = new Date(currentDate);
    targetDate.setHours(11, 0, 0, 0); // Set the target time to 11:00 AM
    if (currentDate >= targetDate)
    {
        targetDate.setDate(targetDate.getDate() + 1);
    }
    return targetDate - currentDate;

}

function updateCountdown()
{
    const timeRemaining = calculateTimeRemaining();

    if (timeRemaining <= 0)
    {
        // Calculate the target date for 11:00 AM of the next day
        const nextDay = new Date();
        nextDay.setHours(11, 0, 0, 0);
        nextDay.setDate(nextDay.getDate() + 1);

        countdown.innerHTML = "Countdown expired!";
        setTimeout(updateCountdown, nextDay - new Date()); // Reset at 11:00 AM next day
    }

    else
    {
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        countdown.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
        setTimeout(updateCountdown, 1000); // Update every 1 second
    }
}

function updateCountdown2()
{
    const timeRemaining = calculateTimeRemaining();

    if (timeRemaining <= 0)
    {
        // Calculate the target date for 11:00 AM of the next day
        const nextDay = new Date();
        nextDay.setHours(11, 0, 0, 0);
        nextDay.setDate(nextDay.getDate() + 1);

        countdown2.innerHTML = "Countdown expired!";
        setTimeout(updateCountdown2, nextDay - new Date()); // Reset at 11:00 AM next day
    }

    else
    {
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        countdown2.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
        setTimeout(updateCountdown2, 1000); // Update every 1 second
    }
}

function parseDateFromString(dateString) {
    var parts = dateString.split('/');
    var day = parseInt(parts[0]);
    var month = parseInt(parts[1]) - 1; // Months are zero-based
    var year = parseInt(parts[2]);
    return new Date(year, month, day);
}

function applyFilter()
{

    var selectedOption = $("input[type='radio'][name=showFilters]:checked", '#Dashboard-Show-Filters-Dropdown_List').val();
    // console.log(selectedOption)

    var columnforAssignedDate = 9;

    if(selectedOption=="last_added")
    {
        var assignedDateElement = document.querySelector("#Dashboard-Data-Table-Header-Row > tr:nth-child(2) > th:nth-child("+columnforAssignedDate+")")
        assignedDateElement.className = "reorder sorting_desc"
    }

    else if(selectedOption=="newly_added")
    {
        var assignedDateElement = document.querySelector("#Dashboard-Data-Table-Header-Row > tr:nth-child(2) > th:nth-child("+columnforAssignedDate+")")
        assignedDateElement.className = "reorder sorting_asc"
    }

    else if(selectedOption=="last_week_added")
    {
        var table = document.getElementById("Main-Data-Table-Content");
        var today = new Date();
        var oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);

        for (var i = 2; i < table.rows.length; i++) { // Start from 1 to skip the header row
            var row = table.rows[i];
            var cell = row.cells[columnforAssignedDate-1];
            var assignedDate = parseDateFromString(cell.textContent);

            if (assignedDate >= oneWeekAgo && assignedDate <= today) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    }
}

function categorySearch()
{
    var searchBar = document.getElementById("categorySearch");
    var list = document.getElementById("MultiSelect-Dropdown-Menu");
    var divItems = list.getElementsByClassName("form-check");
    var listItems = list.getElementsByClassName("form-check-label");

    // Attach input event listener to the search bar for live search
    searchBar.addEventListener("input", function() {
        var searchTerm = searchBar.value.toLowerCase();

        for (var i = 0; i < listItems.length; i++) {
            var text = listItems[i].textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                divItems[i].style.display = "block";
            } else {
                divItems[i].style.display = "none";
            }
        }
    });
}

$.fn.dataTable.ext.type.order['custom-date-asc'] = function(a, b) {
    a = a.split('/').reverse().join('');
    b = b.split('/').reverse().join('');
    return a.localeCompare(b);
};

$.fn.dataTable.ext.type.order['custom-date-desc'] = function(a, b) {
    a = a.split('/').reverse().join('');
    b = b.split('/').reverse().join('');
    return b.localeCompare(a);
}

function collapseSideNav()
{
    a=document.getElementById("Main-Column-Search-Box")
    b = a.getElementsByClassName("sideColumnSearchBar")

    if(document.getElementById("Dashboard-Side-Col").style.display=="")
    {
        // console.log("Hide")
        document.getElementById("Dashboard-Side-Col").style.display="none"
        document.getElementById("Dashboard-Center-Col").className = "col-md-12";
        document.getElementById("after-collapse").style.display="";
        document.getElementById("before-collapse").style.display="none";
        document.getElementById("Main-Data-Table-Content").style.width="120%"
        document.getElementsByClassName("footer")[0].style.width="100%"
        document.getElementById("Dashboard-Download-Files-Button").style.marginLeft="1200px"
        document.getElementById("Dashboard-Main-Info-Product-Details").style.marginLeft="10px"
        document.getElementById("Dashboard-Main-Info-Pane").className="row"
    }

    else
    {
        // console.log("Show")
        document.getElementById("Dashboard-Side-Col").style.display=""
        document.getElementById("Dashboard-Center-Col").className = "col-md-10";
        document.getElementById("after-collapse").style.display="none";
        document.getElementById("before-collapse").style.display="";
        document.getElementById("Main-Data-Table-Content").style.width="200%"
        document.getElementsByClassName("footer")[0].style.width="80%"
        document.getElementById("Dashboard-Download-Files-Button").style.marginLeft="900px"
        document.getElementById("Dashboard-Main-Info-Product-Details").style.marginLeft="0px"
        document.getElementById("Dashboard-Main-Info-Pane").className="container row"
    }
}