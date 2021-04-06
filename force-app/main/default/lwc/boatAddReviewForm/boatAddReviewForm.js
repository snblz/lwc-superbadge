// import { LightningElement, api } from 'lwc';
// import BOAT_REVIEW_OBJECT from "@salesforce/schema/BoatReview__c";
import NAME_FIELD from "@salesforce/schema/BoatReview__c.Name";
import COMMENT_FIELD from "@salesforce/schema/BoatReview__c.Comment__c";
// import RATING_FIELD from '@salesforce/schema/BoatReview__c.Rating__c';
// import { createRecord } from 'lightning/uiRecordApi';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// const SUCCESS_TITLE = "Review Created!";
// const SUCCESS_VARIANT = "Success";
import { LightningElement, api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import RATING_FIELD from '@salesforce/schema/BoatReview__c.Rating__c';
import BOATREVIEW_OBJECT from '@salesforce/schema/BoatReview__c';
const TOAST_TITLE = 'Review Created!';
const TOAST_SUCCESS_VARIANT = 'success';

export default class BoatAddReviewForm extends LightningElement {

   // Private
   boatId;
   rating;
   boatReviewObject = BOATREVIEW_OBJECT;
   nameField = NAME_FIELD;
   commentField = COMMENT_FIELD;
   labelSubject = 'Review Subject';
   labelRating = 'Rating';
   labelComment = "Comment";

   // Public Getter and Setter to allow for logic to run on recordId change
   @api get recordId() {
       return this.boatId;
   }

   set recordId(value) {
       //sets boatId attribute
       //sets boatId assignment
       this.boatId = value;
   }  

   // Gets user rating input from stars component
   handleRatingChanged(event) {
       this.rating = event.detail.rating;
       console.log("handleRatingChanged rating: " + this.rating);
   }

   // Custom submission handler to properly set Rating
   // This function must prevent the anchor element from navigating to a URL.
   // form to be submitted: lightning-record-edit-form
   handleSubmit(event) {
       console.log("handleSubmit")
       event.preventDefault();       // stop the form from submitting
       let fields = event.detail.fields;        
       fields.Rating__c =  this.rating;
       fields.Boat__c =  this.boatId;
       console.log("fields: " + JSON.stringify(fields));
       this.template.querySelector('lightning-record-edit-form').submit(fields);
   }

   // Shows a toast message once form is submitted successfully
   // Dispatches event when a review is created
   handleSuccess() {
       // TODO: dispatch the custom event and show the success message
       // const event = new ShowToastEvent({
       //     title: SUCCESS_TITLE,
       //     variant: TOAST_SUCCESS_VARIANT
       // });
       // this.dispatchEvent(event);
       // const createreview = new CustomEvent("createreview", {});
       // Promise.all([
       //     this.handleReset(),
       //     this.dispatchEvent(createreview)]);
        const evt = new ShowToastEvent({
           title: TOAST_TITLE,
           variant: TOAST_SUCCESS_VARIANT,
       });
       this.dispatchEvent(evt);
       this.dispatchEvent(new CustomEvent('createreview'));
       this.handleReset();
                   
   }

   // Clears form data upon submission
   // TODO: it must reset each lightning-input-field
   handleReset() { 
       const inputFields = this.template.querySelectorAll(
           'lightning-input-field'
       );
       if (inputFields) {
           inputFields.forEach(field => {
               field.reset();
           });
       }
       this.rating = 0;
   }

   connectedCallback() {
       console.log("BoatAddReviewForm boatId: " + this.boatId);
   }
}