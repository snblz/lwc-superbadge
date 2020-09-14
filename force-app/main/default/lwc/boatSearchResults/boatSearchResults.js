import { LightningElement, wire, api } from 'lwc';
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';

import {  publish,
          subscribe,
          unsubscribe,
          APPLICATION_SCOPE,
          MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
export default class BoatSearchResults extends LightningElement {
   
  subscription = null;
  selectedBoatId;
  columns = [];
  boatTypeId = '';
  boats;
  isLoading = false;
  
  // wired message context
  @wire(MessageContext)
  messageContext;
  // wired getBoats method 

  @wire(getBoats, {boatTypeId : '$boatTypeId'})
  wiredBoats(result) { 
    console.log("wired method, with typeid: " + this.boatTypeId);
    console.log("result: " + JSON.stringify(result));
    if (result.data) {
      this.boats = result.data;      
      console.log(JSON.stringify(this.boats));
    };    
  }
  
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  searchBoats(boatTypeId) { }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  refresh() { }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) { 
    console.log("updateSelectedTile: " + event.detail);
    const boatId = { recordId: event.detail };
    publish(this.messageContext, BOATMC, boatId);
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    // explicitly pass boatId to the parameter recordId
  }
  
  // This method must save the changes in the Boat Editor
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave() {
   /* const recordInputs = event.detail.draftValues.slice().map(draft => {
        const fields = Object.assign({}, draft);
        return { fields };
    });
    const promises = recordInputs.map(recordInput =>
            //update boat record
        );
    Promise.all(promises)
        .then(() => {})
        .catch(error => {})
        .finally(() => {});*/
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) { }

  // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
  subscribeToMessageChannel() {
    if (!this.subscription) {
        this.subscription = subscribe(
            this.messageContext,
            BOATMC,
            (message) => this.handleMessage(message),
            { scope: APPLICATION_SCOPE }
        );
    }
}

unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
}

// Handler for message received by component
handleMessage(message) {
    this.boatTypeId = message.recordId;
    console.log("boat type id:" + this.boatTypeId);
}

// Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
connectedCallback() {
    this.subscribeToMessageChannel();
}

disconnectedCallback() {
    this.unsubscribeToMessageChannel();
}
}