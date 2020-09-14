import { LightningElement, api, track, wire } from 'lwc';
const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';
import {  publish,
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
// imports
export default class BoatTile extends LightningElement {
    @api boat;
    @track selectedBoatId;
    subscription = null;
    
    // wired message context
  @wire(MessageContext)
  messageContext;
    
    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() { 
      return 'background-image:url(' + this.boat.Picture__c + ')' ;
    }
    
    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() {
      return  this.boat.Id == this.selectedBoatId ? TILE_WRAPPER_SELECTED_CLASS : TILE_WRAPPER_UNSELECTED_CLASS;      
    }
    
    // Fires event with the Id of the boat that has been selected.
    selectBoat() { 
      this.selectedBoatId = this.boat.Id;
      console.log("selected Tile: " + this.selectedBoatId);
      const selectedTile = new CustomEvent('selectedtile', {detail: this.selectedBoatId});
      this.dispatchEvent(selectedTile);
    }

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
    this.selectedBoatId = message.recordId;
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