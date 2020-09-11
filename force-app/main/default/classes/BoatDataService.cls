public with sharing class BoatDataService {
    @AuraEnabled(cacheable=true)
    public static BoatType__c[] getBoatTypes(){
        BoatType__c[] data = [SELECT Id, Name FROM BoatType__c];
        System.debug(data);
        return data;
    }
}
