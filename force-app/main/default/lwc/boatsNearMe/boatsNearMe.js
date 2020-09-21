import { LightningElement, track, wire } from 'lwc';
import {  publish,
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext } from 'lightning/messageService';
  
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

export default class BoatsNearMe extends LightningElement {
  boatTypeId;
 @track mapMarkers = [];
  isLoading = true;
  isRendered;
  latitude;
  longitude;
  
  @wire(MessageContext)
  messageContext;

  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  wiredBoatsJSON({error, data}) { }
  
  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() { }
  
  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() {
    console.log("getLocationFromBrowser: ");    
    if(!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
      } else {
        console.log('Locating…');
        navigator.geolocation.getCurrentPosition(function(e) {
            this.latitude = e.coords.latitude;
            this.longitude = e.coords.longitude;
            console.log("MAP: lat{" + latitude + "}, long{" + longitude + "}"); 
        }, function() {
            console.log('There was an error.');
        }); 
      }
      
   }
  
  // Creates the map markers
  createMapMarkers(boatData) {
     // const newMarkers = boatData.map(boat => {...});
     // newMarkers.unshift({...});
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