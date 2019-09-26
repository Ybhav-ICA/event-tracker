import assign from 'object-assign';
import AppDispatcher from '../src/flux/AppDispatcher';


var {EventEmitter} = require('fbemitter');

var emitter = new EventEmitter();

var CHANGE_EVENT = 'change';

// User defined variables   --- START

var user = null;
var mandatoryCheck = false;
var event = {};
var displayHeader = true;

// User defined variables   --- END

var MainStore = assign({}, EventEmitter.prototype, {


    // User defined functions   --- START

    getUser() {
        return user;
    },

    getMandatoryCheck() {
        return mandatoryCheck;
    },

    getEvent() {
        return event;
    },

    getDisplayHeader() {
        return displayHeader;
    },


    // User defined functions   --- END


    getAppDispatcher: function () {
        return AppDispatcher;
    },

    emitChange: function (subType) {
        var subType = subType || CHANGE_EVENT;
        emitter.emit(CHANGE_EVENT, subType, subType);
    },

    addChangeListener: function (callback) {
        var token = emitter.addListener(CHANGE_EVENT, callback);
        return token;
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        var action = payload.action;

        switch (action.actionType) {
            case "SET_USER":
                user = action.user;
                MainStore.emitChange(action.actionType);
                break;
            case "ON_FORM_SUBMIT":
                mandatoryCheck = action.mandatoryCheck;
                MainStore.emitChange(action.actionType);
                break;
            case "SUBMIT_REPORT":
                mandatoryCheck = action.mandatoryCheck;
                MainStore.emitChange(action.actionType);
                break;
            case "GET_EVENTS":
                MainStore.emitChange(action.actionType);
                break;
            case "STORE_EVENT":
                event = action.event;
                break;
            case "TOGGLE_HEADER":
                displayHeader = action.displayHeader;
                MainStore.emitChange(action.actionType);
                break;
        }

        return true; // No errors. Needed by promise in Dispatcher.
    })

});

export default MainStore;