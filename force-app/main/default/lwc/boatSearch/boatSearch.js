import { LightningElement } from 'lwc';
 // imports
 import { NavigationMixin } from 'lightning/navigation'; 
//import BOATMC from '@salesforce/...';
export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;
    
    // Handles loading event
    handleLoading() {
      this.isLoading = true;
     }
    
    // Handles done loading event
    handleDoneLoading() { 
      this.isLoading = false;
    }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) { 
      console.log("searchBoats: ");
      console.log(event.detail);
    }
    
    createNewBoat() {      
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c',
                actionName: 'new'
            },
        });
      }
     
  }