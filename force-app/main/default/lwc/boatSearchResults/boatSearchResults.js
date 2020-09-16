import { LightningElement, wire, api, track } from 'lwc';
import {  publish,
          subscribe,
          unsubscribe,
          APPLICATION_SCOPE,
          MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import TILEMC from '@salesforce/messageChannel/TileMessageChannel__c';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';
const columns = [
  { label: 'Name', fieldName: 'Name', editable: true },
  { label: 'Length', fieldName: 'Length__c', editable: true},
  { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
  { label: 'Description', fieldName: 'Description__c', editable: true }
];

export default class BoatSearchResults extends LightningElement {
   
  subscription = null;
  selectedBoatId;
  columns = [];
  boatTypeId = '';
  boats;
  isLoading = false;
  columns = columns;
  @track draftValues = [];

  // wired message context
  @wire(MessageContext)
  messageContext;
  // wired getBoats method 

  @wire(getBoats, {boatTypeId : '$boatTypeId'})
  wiredBoats(result) { 
    //console.log("wired method, with typeid: " + this.boatTypeId);
    //console.log("result: " + JSON.stringify(result));
    if (result.data) {
      this.boats = result.data;   
      console.log("boats: " + JSON.stringify(this.boats));   
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
    publish(this.messageContext, TILEMC, boatId);
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    // explicitly pass boatId to the parameter recordId
  }
  
  // This method must save the changes in the Boat Editor
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    const recordInputs = event.detail.draftValues.slice().map(draft => {
        const fields = Object.assign({}, draft);
        return { fields };
    });
    console.log("recordInputs ==> " + JSON.stringify(recordInputs));
    
   const promises = recordInputs.map(recordInput =>{
            //update boat record
         /*   var boat;
            for(var index in this.boats){
              boat = this.boats[index]; 
              console.log("boat.Id: " + boat.Id + ", recordInput.Id: " + recordInput["fields"].Id);
              if(boat.Id === recordInput["fields"].Id){
                console.log("true");
                if(recordInput["fields"].hasOwnProperty("Name")){
                  this.boats[index]
                }
              }
            }*/
          });
   /* Promise.all(promises)
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
}

// Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
connectedCallback() {
    this.subscribeToMessageChannel();
}

disconnectedCallback() {
    this.unsubscribeToMessageChannel();
}
}