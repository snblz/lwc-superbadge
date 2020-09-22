import { LightningElement, wire } from 'lwc';
 // imports
 import { NavigationMixin } from 'lightning/navigation'; 
//import BOATMC from '@salesforce/...';
import { publish, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;
    
    @wire(MessageContext)
    messageContext;

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
      const boatId = { recordId: event.detail.boatTypeId };
      publish(this.messageContext, BOATMC, boatId);
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