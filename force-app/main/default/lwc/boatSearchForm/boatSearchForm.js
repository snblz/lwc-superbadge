import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import BOAT_LOADING_MESSAGE from '@salesforce/messageChannel/BoatMessageChannel__c';

// imports
// import getBoatTypes from the BoatDataService => getBoatTypes method';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';
export default class BoatSearchForm extends LightningElement {
    selectedBoatTypeId = '';
    
    // Private
    error = undefined;
    
    // Needs explicit track due to nested data
    searchOptions;
    
    // Wire a custom Apex method
    @wire(getBoatTypes)
     boatTypes({ error, data }) {
      console.log('boat types method');
      console.log(JSON.stringify(data));
      if (data) {        
        this.searchOptions = data.map(type => {        
          return {label : type.Name, value :type.Id }
        });
        this.searchOptions.unshift({ label: 'All Types', value: 'all' });
      } else if (error) {
        this.searchOptions = undefined;
        this.error = error;
      }
    }
    
    // Fires event that the search option has changed.
    // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
    handleSearchOptionChange(event) {
      // Create the const searchEvent
      // searchEvent must be the new custom event search
      this.selectedBoatTypeId = event.target.value;
      console.log("target val: " + this.selectedBoatTypeId);
      const searchEvent = new CustomEvent('searchevent', {detail: this.selectedBoatTypeId});
      this.dispatchEvent(searchEvent);
    }
  }