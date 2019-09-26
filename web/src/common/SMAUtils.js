import React, {Component} from 'react';
import toastr from 'toastr';
import moment from "moment/moment";

export default class SMAUtils extends Component {
    static unSavedChanges = false;

    static logAjaxError(xhr, status, err) {
        if (xhr.responseJSON) {
            toastr.error(xhr.responseJSON.errorMessage);
        } else if (xhr.responseText) {
            toastr.error(xhr.responseText);
        }
    }

    static removeToastr() {
        toastr.remove();
    }

    static warning(message) {
        toastr.remove();
        toastr.warning(message);
    }

    static error(message) {
        toastr.remove();
        toastr.error(message);
    }

    static success(message) {
        toastr.remove();
        toastr.success(message);
    }

    static buildOptions(res) {
        var options = [];
        if (res && res.length > 0) {
            for (var i = 0; i < res.length; i++) {
                options.push({id: res[i].optionId, value: res[i].optionId, text: res[i].option, key: i});
            }
        }
        return options;
    }

    static validateString(str, flag) {
        var error = false;
        if ((str == '' || str.trim().length == 0) && flag) {
            error = true;
        }else if(str.length>30000){
            error=true;
        }
        return error;
    }

    static validateNumber(str, flag) {
        var error = false;
        if ((str == '' || str.trim().length == 0) && flag) { // not empty
            error = true;
        } else if (isNaN(str)) {
            error = true;
        } else if (str.indexOf("-") != -1 || str.indexOf(".") != -1) { // negative validation and percentage
            error = true;
        }else if(parseInt(str)>100000000){
            error=true;
        }
        return error;
    }

    static validatePercentage(str, flag) {
        var error = false;
        if ((str == '' || str.trim().length == 0) && flag) { // not empty
            error = true;
        } else if (isNaN(str)) {
            error = true;
        } else if (str.indexOf("-") != -1) { // negative validation and percentage
            error = true;
        } else if (parseFloat(str) > 100) { // should not be more than 100
            error = true;
        }
        return error;
    }

    static validateDecimal(str, flag) {
        var error = false;
        if ((str == '' || str.trim().length == 0) && flag) { // not empty
            error = true;
        } else if (isNaN(str)) {
            error = true;
        } else if (str.indexOf("-") != -1) { // negative validation and percentage
            error = true;
        }else if(parseFloat(str)>100000000){
            error=true;
        }
        return error;
    }

    static validateMandatoryFieldDropdown(str) {
        var error = false;
        if (!str || str == '') { // not empty
            error = true;
        }
        return error;
    }

    static getDateTime(_date) {
        var date = '';
        var time = '';
        if (_date) {
            const dateObj = moment(_date).format("DD-MM-YYYY hh:mm a");
            const dateObjArr = dateObj.split(" ");
            date = dateObjArr[0];
            time = dateObjArr[1] + ' ' + dateObjArr[2].toUpperCase();
        }
        return {date, time};
    }

    static validateEmail(email){
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return (reg.test(email) == false);
    }


    render() {
        return (
            <p/>
        );
    }

}
