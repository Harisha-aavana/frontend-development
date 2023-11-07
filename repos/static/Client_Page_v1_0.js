// const upload = require("../../upload")

// var dataArray = [["UID","Entity Name","Location Code","Type of License","State","District","Locality","Assigned Date","Document Status", "Comment","",""],
// ["123","Bharti Private Limited","PO-12124","Water OC","Karnataka","Bangalore","Gokul Road","19/06/2023","Pending","","",""],
// ["456","ABC Private Limited","PO-12134245","Air OC","Karnataka","Mangalore","HE Road","19/07/2023","Pending","","",""],
// ["789","DEF Private Limited","PO-17354426","Wood OC","Karnataka","Tumkur","SS Road","19/01/2023","Pending","","",""],
// ["1","Bharti Private Limited","PO-12124","Water OC","Karnataka","Bangalore","Gokul Road","19/06/2023","Pending","","",""],
// ["2","ABC Private Limited","PO-12134245","Air OC","Karnataka","Mangalore","HE Road","19/07/2023","Pending","","",""],
// ["3","DEF Private Limited","PO-17354426","Wood OC","Karnataka","Tumkur","SS Road","19/01/2023","Pending","","",""],
// ["4","Bharti Private Limited","PO-12124","Water OC","Karnataka","Bangalore","Gokul Road","19/06/2023","Pending","","",""],
// ["5","ABC Private Limited","PO-12134245","Air OC","Karnataka","Mangalore","HE Road","19/07/2023","Pending","","",""],
// ["6","DEF Private Limited","PO-17354426","Wood OC","Karnataka","Tumkur","SS Road","19/01/2023","Pending","","",""],
// ["7","Bharti Private Limited","PO-12124","Water OC","Karnataka","Bangalore","Gokul Road","19/06/2023","Pending","","",""],
// ["8","ABC Private Limited","PO-12134245","Air OC","Karnataka","Mangalore","HE Road","19/07/2023","Pending","","",""],
// ["9","DEF Private Limited","PO-17354426","Wood OC","Karnataka","Tumkur","SS Road","19/01/2023","Pending","","",""],
// ["901","Bharti Private Limited","PO-12124","Water OC","Karnataka","Bangalore","Gokul Road","19/06/2023","Pending","","",""],
// ["902","ABC Private Limited","PO-12134245","Air OC","Karnataka","Mangalore","HE Road","19/07/2023","Pending","","",""],
// ["903","DEF Private Limited","PO-17354426","Wood OC","Karnataka","Tumkur","SS Road","19/01/2023","Pending","","",""],
// ["904","Bharti Private Limited","PO-12124","Water OC","Karnataka","Bangalore","Gokul Road","19/06/2023","Pending","","",""],
// ["905","ABC Private Limited","PO-12134245","Air OC","Karnataka","Mangalore","HE Road","19/07/2023","Pending","","",""],
// ["906","DEF Private Limited","PO-17354426","Wood OC","Karnataka","Tumkur","SS Road","19/01/2023","Pending","","",""],
// ["907","Bharti Private Limited","PO-12124","Water OC","Karnataka","Bangalore","Gokul Road","19/06/2023","Pending","","",""],
// ["908","ABC Private Limited","PO-12134245","Air OC","Karnataka","Mangalore","HE Road","19/07/2023","Pending","","",""],
// ["909","DEF Private Limited","PO-17354426","Wood OC","Karnataka","Tumkur","SS Road","19/01/2023","Pending","","",""],
// ["910","Bharti Private Limited","PO-12124","Water OC","Karnataka","Bangalore","Gokul Road","19/06/2023","Pending","","",""],
// ["911","ABC Private Limited","PO-12134245","Air OC","Karnataka","Mangalore","HE Road","19/07/2023","Pending","","",""],
// ["912","DEF Private Limited","PO-17354426","Wood OC","Karnataka","Tumkur","SS Road","19/01/2023","Pending","","",""]
// ]

var optionsList = ["License","Applied Copy","Receipt Copy","Challan","Acknowledgement","License cum Receipt","Bank Charges","Acknowledgement and Receipt","Others"]

var columnsToHide = {"Locality":6,"Project_ID":7} ;
var columnsIndexToHide = [6,7] ;


$(document).ready(function(){
    console.log("Here")
    uploadFileObject={"draw":1,"start":0}
    $.ajax({
        type: "POST",
        url: "/aavana_home",
        data: uploadFileObject, 
        dataType: 'json',
        success: function(res){
            dataArray = res["dataArray"]
            populateTable(dataArray)
    
            const Upload_File_button_nodeList = document.querySelectorAll('[id^="Upload-Files-Button-Row"]');
            for(let i=0;i<Upload_File_button_nodeList.length;i++)
            {   
                Upload_File_button_nodeList[i].addEventListener('click', function handleClick() {
                    document.getElementById('Dashboard-Modal-Table-Body-Row').innerHTML='';
                    populateUploadFilesPage(optionsList,Upload_File_button_nodeList[i].getAttribute('data-uid'),Upload_File_button_nodeList[i].getAttribute('data-pid'))

                });
            }
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
            th_element.innerText="Select File Type";
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
            button_element.innerHTML='<i class="fa-solid fa-file" title="Add Documents" style="cursor:pointer;font-size:20px;margin-left:40px;"></i>'

            td_element.appendChild(button_element)
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

            else if(j==dataArray[i].length-2)
            {
                var td_element = document.createElement('td');

                var anchor_element = document.createElement('a');
                anchor_element.classList.add("Add-Comment-Button")
                var anchor_toggle_attr = document.createAttribute('href')
                anchor_toggle_attr.value="#"
                var anchor_toggle_attr = document.createAttribute('data-bs-toggle')
                anchor_toggle_attr.value="modal"
                
                var anchor_id_attr = document.createAttribute('id')
                anchor_id_attr.value = "Add-Comment-Button-Row-"+(i)  // Here we are not doing i+1, because first row i.e. 0 will be the header. Thus, we will start from index 1 and hence it will be Row 1
                var anchor_uid_attr = document.createAttribute('data-UID')
                

                anchor_element.setAttributeNode(anchor_toggle_attr)
                
                anchor_element.setAttributeNode(anchor_id_attr)

                anchor_uid_attr.value=dataArray[i][0]
                anchor_element.setAttributeNode(anchor_uid_attr)

                var anchor_target_attr = document.createAttribute('onclick')
                anchor_target_attr.value="openAddCommentModal("+dataArray[i][0]+","+i+")"
                anchor_element.setAttributeNode(anchor_target_attr)

                anchor_element.innerHTML='<i class="fa-sharp fa-solid fa-commenting" title="Add Comments" style="cursor:pointer;font-size:15px;margin-left:40px;"></i>'

                td_element.appendChild(anchor_element)

                tr_element.appendChild(td_element)

            }

            else if(j==dataArray[i].length-1)
            {
                var td_element = document.createElement('td');

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
                // anchor_element_2.setAttributeNode(anchor_id_attr_2)

                anchor_uid_attr_2.value=dataArray[i][0]
                anchor_element_2.setAttributeNode(anchor_id_attr_2)
                anchor_element_2.innerHTML='<i class="fa-sharp fa-solid fa-pen-to-square" title="Edit Comments" style="cursor:pointer;font-size:15px;margin-left:-40px;"></i>'

                td_element.appendChild(anchor_element_2)

                tr_element.appendChild(td_element)

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

    // $("#Main-Data-Table-Content").DataTable({
    //     searching: false,
    //     ordering:false,
    //     dom: "fltip"
    
    // });

    var showColumnsDropdownElement = document.getElementById("Dashboard-Show-Columns-Dropdown_List")
    showColumnsDropdownElement.addEventListener('change', function(){

        var checkboxes = document.querySelectorAll("#Dashboard-Show-Columns-Dropdown_List .form-check-input");
    
        // Starting from index, because "Basic Columns" will be by-default cehcked all the time and it will be at index 0
        for (var i = 1; i < checkboxes.length; i++) 
        {
            var selectedColumn = checkboxes[i].value;
            var indexforColumn = columnsToHide[selectedColumn]

            var elementColumnsList = document.getElementsByClassName("Main-Data-Table-Column-"+(indexforColumn+1))
            for(let j=0;j<elementColumnsList.length;j++)
            {
                var elementColumns = elementColumnsList[j]
                
                console.log("Inside ..")
                if (elementColumns.style.display === "none") {
                    console.log("right !!")
                    elementColumns.style.display = null;
                } else {
                    elementColumns.style.display = "none";
                }
            }
            
            
            
        }
        

    })
}

function populateUploadFilesPage(optionsList,argv,pid)
{
    var dropdownMenu = document.getElementById('MultiSelect-Dropdown-Menu');
    var HTML_content="";
    for(let i=0;i<optionsList.length;i++)
    {
        HTML_content += `<div class="form-check" style="margin-left:10px;font-size:13px;padding-right:20px;">
        <input type="checkbox" name="dropdownCheckBox" value="`+optionsList[i]+`" class="form-check-input" id="`+pid+`-`+argv+`-`+(i+1)+`">
        <label class="form-check-label" for="`+(i+1)+`">`+optionsList[i]+`</label>
    </div>`
    }

    dropdownMenu.innerHTML=HTML_content;
    
    var tableBody = document.getElementById('Dashboard-Modal-Table-Body-Row');
    tableBody.innerHTML= tableBody.innerHTML;

    // var categoryTypes = document.getElementById(argv+"-"+(i+1));
    // console.log(categoryTypes)

    var dropdownListNodes  = document.querySelectorAll("#MultiSelect-Dropdown-Menu .form-check .form-check-input")
    for(let i=0;i<dropdownListNodes.length;i++)
    {
        dropdownListNodes[i].addEventListener("change",function(){
            if(dropdownListNodes[i].checked)
            {
                var UID_Row = (dropdownListNodes[i].id).split("-")
                var PID_key = UID_Row[0]
                var UID_key=UID_Row[1]
                var Row_Key=parseInt(UID_Row[2])-1
                addCategories(dropdownListNodes[i].value,Row_Key,UID_key,PID_key)
            }
        })
    }

}

function addCategories(optionsList,i,argv,pid)
{

    var tableBody = document.getElementById('Dashboard-Modal-Table-Body-Row');

    var tr_element = document.createElement('tr');   
    var HTML_content = `<td><div class="form-check"><input class="form-check-input" data-pid="`+pid+`" data-uid="`+argv+`" file_id='`+(i+1)+`' type="checkbox" name="categoryCheckBox" value="`+optionsList+`" id="flexCheckDefault-Row-`+(i+1)+`" onchange="if(document.getElementById('Upload-Files-Modal-Button-Row-`+(i+1)+`-`+argv+`').disabled==true){document.getElementById('Upload-Files-Modal-Button-Row-`+(i+1)+`-`+argv+`').disabled=false} else {document.getElementById('Upload-Files-Modal-Button-Row-`+(i+1)+`-`+argv+`').disabled=true}" checked><label class="form-check-label" for="flexCheckDefault-Row-`+(i+1)+`"></label></div></td>
    <td file_id='`+(i+1)+`' id="category_sno_`+(i+1)+`">`+optionsList+`</td>
    <td><form id="Upload-Form-Modal-Input-Row"><input type='file' data-pid="`+pid+`" data-uid="`+argv+`" id="Upload-Files-Modal-Input-Row-`+(i+1)+`-`+argv+`" name='documentUpload' onchange="addFileUploadList('`+i+`','`+argv+`','`+pid+`','Upload-Files-Modal-Input-Row-`+(i+1)+`-`+argv+`')" style="display: none;"><button type="button" class="btn btn-primary" style="font-size:12px; margin-top:-5px" id="Upload-Files-Modal-Button-Row-`+(i+1)+`-`+argv+`" onclick="document.getElementById('Upload-Files-Modal-Input-Row-`+(i+1)+`-`+argv+`').click()">Upload</button></input></form></td>
    <td id="Uploaded-File-Name-Row-`+(i+1)+`"></td>
    <td><button id="Uploaded-File-Delete-Row-`+(i+1)+`" class="btn" style="margin-top: -10px; display:none" onclick=""><i class="fa fa-trash" aria-hidden="true" style="color:#940d12"></i></button></td>`
    
    var modal_tr_id_attr = document.createAttribute('id')
    modal_tr_id_attr.value = "inner_tablebody_tr_"+argv+"_"+(i+1);
    tr_element.setAttributeNode(modal_tr_id_attr)

    tr_element.innerHTML=HTML_content;
    tableBody.appendChild(tr_element)

    // document.getElementById("addCategory").setAttribute("onclick","addCategories("+argv+")")


    // masterCheckboxElement = document.getElementById("flexCheckDefault2");
    // console.log(masterCheckboxElement)
    // masterCheckboxElement.addEventListener("change",function handleCheckBox() {
    //     console.log("clicked ..")
    //     var checkboxes = document.querySelectorAll("#Dashboard-Modal-Table-Body-Row .form-check-input");
    //     for (var i = 0; i < checkboxes.length; i++) {
    //         checkboxes[i].checked = mainCheckbox.checked;
    //     }
    //     $("input:checkbox").prop('checked', $(this).prop("checked"));
    // })


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
    console.log(document.getElementById(elementDeleteID))

    document.getElementById(elementNameID).innerText = uploadedFileName
    document.getElementById(elementDeleteID).style.display=null;

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

            var file = document.getElementById("Upload-Files-Modal-Input-Row-"+file_id+"-"+task_id).files[0];

            var uploadObj = {
            "task_id":task_id,
            "project_id":project_id,
            "file_id":file_id,
            "file":file           
            }

            // console.log(uploadObj)

            // $.ajax({
            //     type: "POST",
            //     url: "/upload_file",
            //     data: uploadObj, 
            //     dataType: 'json',
            //     success: function(document_id){
            //         document.getElementById("Uploaded-File-Delete-Row-"+file_id).setAttribute("onclick","deleteFileEntry("+document_id+",inner_tablebody_tr_"+argv+"_"+file_id+";)");
            //     }
            // });


        }
    }
}

function deleteFileEntry(document_id,tr_element_id)
{
    console.log(document_id)
    console.log(tr_element_id)
    console.log("We are in delete Button Function!")

    // $.ajax({
    //     type: "POST",
    //     url: "/deleteFileData",
    //     data: {"document_id":docuent_id}, 
    //     dataType: 'json',
            // success: function(){
            //     document.getElementById(tr_element_id).remove();
            // }
    // });

}

function openAddCommentModal(task_id, row_num)
{
    console.log(task_id)
    console.log(row_num)

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
    
    // $.ajax({
    //     type: "GET",
    //     url: "/getCommentsHistory",
            // success: function(res){
            //     console.log(res)
                // if(res.length>0)
                // {

                // }
            // }
    // });

}

function addComment(task_id, row_num)
{
    console.log("AJAX Comment")
    var comment = document.getElementById("addCommentTextarea-"+task_id+"-"+row_num).value;

    var comment_type="internal"
    if(document.getElementById("check-internal-external-"+task_id+"-"+row_num).checked)
    {
        comment_type="external"
    }

    var uploadCommentObj = {
        "task_id": task_id,
        "comment":comment,
        "comment_type":comment_type
    }

    console.log(uploadCommentObj)

    // $.ajax({
    //     type: "POST",
    //     url: "/uploadComments",
    //     data: uploadCommentObj, 
    //     dataType: 'json',
            // success: function(){
            //     window.reload();
            // }
    // });
}