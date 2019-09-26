import React, {Component} from 'react';
import {Dimmer, Loader, Button, Divider} from 'semantic-ui-react';
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-fresh.css';
import _ from "underscore";
import toastr from "toastr";
import CreateUser from "./CreateUser";
import MainStore from '../../../MainStore'
import EditUserRenderer from "./EditUserRenderer";
import ConfirmationPopUp from "../../../common/ConfirmationPopUp";
import EditUser from "./EditUser";
import SMAUtils from "../../../common/SMAUtils";

const jq = window.$;

export default class ManageUsers extends Component {


    state = {
        user: {id: 1},
        roleId: '',
        openFlag: false,
        closeFlag: false,
        openEdit: false,
        showPopUp: false,
        showPopUpConstituency: false,
        selectedRow: {},
        disableLoader: true,
        deleteDisable: true,
        showUser: true,
        columnDefs: [
            {
                headername: "", field: "",
                minWidth: 60, maxWidth: 60,
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
                checkboxSelection: this.checkboxSelection.bind(this),
            },
            {
                headerName: "User Name",
                field: "userName",
                minWidth: 130,
                cellClass: function (params) {
                    return (params.node.group ? 'visible-cell' : 'non-vis-text');
                }
            },
            {
                headerName: "Email Id",
                field: "email",
                minWidth: 130,
                cellClass: function (params) {
                    return (params.node.group ? 'visible-cell' : 'non-vis-text');
                }
            },
            {
                headerName: "Mobile No",
                field: "mobileNo",
                minWidth: 130,
                cellClass: function (params) {
                    return (params.node.group ? 'visible-cell' : 'non-vis-text');
                }
            },
            {
                headerName: "Role",
                field: "roleName",
                minWidth: 130,
                cellClass: function (params) {
                    return (params.node.group ? 'visible-cell' : 'non-vis-text');
                }
            },
            {
                headerName: "State",
                field: "stateName",
                minWidth: 130,
                cellClass: function (params) {
                    return (params.node.group ? 'visible-cell' : 'non-vis-text');
                }
            },
            {
                headerName: "Parliament Constituency",
                field: "constituencyName",
                minWidth: 130,
                cellClass: 'manage-user-left-align',
                cellRenderer: 'group',

            },
            {
                headerName: "Action",
                field: "action",
                cellRendererFramework: EditUserRenderer,
                minWidth: 150,
                maxWidth: 150,
                suppressMenu: true,
                suppressSorting: true,
            },

        ],
        rowData: [],
        gridOptions: {
            suppressRowClickSelection: true,
            enableColResize: true,
            hideGroup: true,
            getNodeChildDetails: this.getNodeChildDetails.bind(this),
            getRowClass: function (params) {
                return 'grid-row';
            }
        },

    };
    onGridReady = (params) => {
        this.api = params.api;
        this.columnApi = params.columnApi;
        params.api.sizeColumnsToFit();
    };

    checkboxSelection(params) {
        return params.node.group == true;
    }

    getNodeChildDetails(rowItem) {
        if (rowItem.constituencyName && rowItem.children) {
            return {
                group: true,
                children: rowItem.children,
                field: 'constituencyName',
                key: rowItem.constituencyName,
                id: rowItem.constituencyId
            };
        } else {
            return null;
        }
    }

    onWindowResizeListener() {
        let that = this;

        this.windowResize = window.addEventListener("resize", function () {
            if (that.api)
                that.api.sizeColumnsToFit();
            /*  var width = window.innerWidth < 1300 ? '100%' : '50%';
              that.setState({columnWidth: width});*/

        });
    }

    componentDidMount() {
        this.setState({user: JSON.parse(sessionStorage.user)});
        this.onWindowResizeListener();
        this.getUserData();
        if (this.api)
            this.api.sizeColumnsToFit();

    }

    componentWillUnmount() {
        if (this.windowResize)
            this.windowResize.remove();
    }


    getUserData() {
        let user = this.state.user;
        this.setState({disableLoader: false, roleId: user.roleId});
        var that = this;
        jq.post({
            url: window.ajaxPrefix + "mvc/getEventUsers?loginUserId=" + this.state.user.id,
            type: "GET",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                var resdata = response;
                that.handleUserResponse(resdata);

            },
            error: function (xhr) {

                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);

                that.setState({disableLoader: true});

            }
        });
    }

    handleUserResponse(resdata) {
        let rowData = [];
        for (let i = 0; i < resdata.length; i++) {
            let selRow = _.findWhere(rowData, {userId: resdata[i].userId});
            let childRow = {};
            childRow.userName = resdata[i].userName;
            childRow.userId = resdata[i].userId;
            childRow.roleId = resdata[i].roleId;
            childRow.roleName = resdata[i].roleName;
            childRow.email = resdata[i].email;
            childRow.mobileNo = resdata[i].mobileNo;
            childRow.stateId = resdata[i].stateId;
            childRow.stateName = resdata[i].stateName;
            childRow.constituencyId = resdata[i].constituencyId;
            childRow.constituencyName = resdata[i].constituencyName;
            if (selRow) {
                selRow.children.push(childRow);
            }
            else {
                let row = {};
                row.userName = resdata[i].userName;
                row.userId = resdata[i].userId;
                row.roleId = resdata[i].roleId;
                row.roleName = resdata[i].roleName;
                row.email = resdata[i].email;
                row.mobileNo = resdata[i].mobileNo;
                row.stateId = resdata[i].stateId;
                row.stateName = resdata[i].stateName;
                row.constituencyId = resdata[i].constituencyId;
                row.constituencyName = "Assigned Parliments";
                row.children = [];
                if (childRow.constituencyId != -1)
                    row.children.push(childRow);
                rowData.push(row);
            }
        }
        this.setState({rowData: rowData, disableLoader: true});
        if (this.api)
            this.api.sizeColumnsToFit();
    };

    deleteUserConstituency(userId, constituencyId, stateId) {
        //let user = JSON.parse(sessionStorage.user);
        let user = this.state.user;
        this.setState({disableLoader: false});
        var that = this;
        jq.post({
            url: window.ajaxPrefix + "mvc/deleteAssignedConstituency?loginUserId=" + user.id + "&eventUserId=" + userId +
            "&stateId=" + stateId + "&constyId=" + constituencyId,
            type: "DELETE",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                if (response) {
                    that.setState({disableLoader: true});
                    SMAUtils.success("  Deleted User Constituency Successfully!");
                    that.getUserData();

                } else {
                    SMAUtils.error(" Error occured while deleting !");

                }
            },
            error: function (xhr, status, err) {

                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);

                SMAUtils.success(" Error occured while deleting !");

                that.setState({disableLoader: true});

            }
        });
        this.setState({deleteDisable: true});


    };

    deleteUser(userIds) {
        //let user = JSON.parse(sessionStorage.user);
        let user = this.state.user;
        this.setState({disableLoader: false});
        var that = this;
        jq.post({
            url: window.ajaxPrefix + "mvc/deleteEventUser?loginUserId=" + user.id + "&eventUserIds=" + userIds,
            type: "DELETE",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                if (response) {
                    that.setState({disableLoader: true});
                    SMAUtils.success(" User Deleted Successfully!");
                    that.getUserData();
                }
            },
            error: function (xhr, status, err) {

                if (xhr.responseJSON)
                    SMAUtils.error(xhr.responseJSON.errorMessage);


                that.setState({disableLoader: true});

            }
        });
        this.setState({deleteDisable: true});


    };

    onClickeDeleteConstituency = () => {

        this.setState({showPopUpConstituency: false});
        this.deleteUserConstituency(this.state.selectedRow.userId, this.state.selectedRow.constituencyId, this.state.selectedRow.stateId);

    };

    handleDeleteUser = () => {
        var selectedRowData = this.api.getSelectedRows();
        this.setState({showPopUp: false});
        var ids = '';
        for (var i = 0; i < selectedRowData.length; i++) {
            if (selectedRowData[i].children) {
                ids += selectedRowData[i].userId + ",";
            }
        }
        ids = ids.substr(0, ids.length - 1);
        this.setState({deleteDisable: false});
        this.deleteUser(ids);
    };


    oncloseModal = () => {
        this.setState({openFlag: false});
    };
    handleCreateUser = () => {
        this.setState({openFlag: true, closeFlag: false});
    };
    onUserSave = () => {
        this.setState({openFlag: false});
        this.getUserData();

    };
    onEditUserSave = () => {
        this.setState({openFlag: false});
        this.getUserData();
    }
    openPopUp = () => {
        this.setState({showPopUp: !this.state.showPopUp});

    };
    openPopUpConstituency = () => {


        this.setState({showPopUpConstituency: !this.state.showPopUpConstituency});

    };

    onSelection = () => {
        let size = this.api.getSelectedNodes().length;
        if (size > 0)
            this.setState({deleteDisable: false, selectedRow: {}});
        else
            this.setState({deleteDisable: true, selectedRow: {}});
    };
    closeEdit = () => {
        var open = !this.state.openEdit;
        this.setState({openEdit: open});
        if (!open) {
            this.state.selectedRow = {};
        }
    };

    onCellClicked = (params) => {
        if (params.colDef.field == "action") {
            if (params.node.group) { //this is for edit
                var open = !this.state.openEdit;
                this.state.selectedRow = params.data;
                this.setState({selectedRow: params.data, openEdit: open});
            }
            else { //this is for deleting constituency
                if (params.data.constituencyId <= -1) {

                } else {
                    var open = !this.state.openEdit;
                    this.state.selectedRow = params.data;
                    this.setState({selectedRow: params.data, showPopUpConstituency: !this.state.showPopUpConstituency});
                }
            }
        }
    };

    render() {
        let st = this.state;
        return (
            <div id='manage-user'>
                <CreateUser
                    openFlag={this.state.openFlag}
                    closeModal={this.oncloseModal}
                    onSave={this.onUserSave}
                />

                <div className='container-fluid manage-user-header'>
                    <div className='row'>
                        <div className='col-2' style={{marginLeft: -10}}>
                            <h3>List of Users</h3>
                        </div>

                        <div className='col-10'>
                            <div style={{display: 'flex', justifyContent: 'flex-end', marginRight: -20}}>
                                <Button
                                    icon='trash'
                                    labelPosition='left'
                                    disabled={st.deleteDisable}
                                    color='red' content='Delete'
                                    onClick={this.openPopUp}
                                />
                                <Button
                                    color='teal' icon='plus' content='Create User'
                                    labelPosition='left'
                                    onClick={this.handleCreateUser}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Divider/>

                <div className="tableMargin">
                    <div className="ag-fresh" style={{height: 600, textAlign: "center"}}>
                        <AgGridReact
                            rowSelection="multiple"
                            onRowSelected={this.onSelection}
                            onCellClicked={this.onCellClicked}
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}
                            gridOptions={this.state.gridOptions}
                            enableSorting="true"
                            enableFilter="true"
                            enableColResize="true"
                            rowHeight="40"
                            headerHeight="50"
                            onGridReady={this.onGridReady}
                        />
                    </div>
                </div>

                <EditUser open={st.openEdit} close={this.closeEdit} value={st.selectedRow}
                          onSave={this.onEditUserSave}/>

                <ConfirmationPopUp
                    onYes={this.onClickeDeleteConstituency} headerName="Delete Constituency"
                    message="This is a permanent action and cannot be undone."
                    headerMessage="Are you sure you want to delete this Constituency?"
                    textColor="#EB0F0F"
                    isOpen={this.state.showPopUpConstituency} close={this.openPopUpConstituency}
                />

                <ConfirmationPopUp
                    onYes={this.handleDeleteUser} headerName="Delete User "
                    message="This is a permanent action and cannot be undone."
                    headerMessage="Are you sure you want to delete this Users?"
                    textColor="#EB0F0F"
                    isOpen={this.state.showPopUp} close={this.openPopUp}
                />

                <Dimmer inverted active disabled={st.disableLoader} page={!st.disableLoader}>
                    <Loader size='huge' disabled={st.disableLoader} content="Loading"/>
                </Dimmer>
            </div>
        );
    }
}
