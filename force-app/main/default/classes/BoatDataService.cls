public with sharing class BoatDataService {
    @AuraEnabled(cacheable=true)
    public static BoatType__c[] getBoatTypes(){
        BoatType__c[] data = [SELECT Id, Name FROM BoatType__c];
        System.debug(data);
        return data;
    }

    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getBoats(String boatTypeId){
        List<Boat__c> result = null;
        if(boatTypeId.toLowerCase() == 'all'){
            result = [SELECT Id, Name, Boat_Image__c, BoatType__c, Contact__r.Name, Description__c, 
                            Length__c, Picture__c, Price__c, Year_Built__c, BoatType__r.Name 
                    FROM Boat__c];
            System.debug('getBoats, boatTypeId: ' + boatTypeId);
            System.debug(result);  
        }else{
          result  = [SELECT Id, Name, Boat_Image__c, BoatType__c, Contact__r.Name, Description__c, Length__c, Picture__c, Price__c, Year_Built__c, BoatType__r.Name
                    FROM Boat__c
                    WHERE BoatType__c = :boatTypeId];
            System.debug('getBoats, boatTypeId: ' + boatTypeId);
            System.debug(result);
            
        }
        return result;
    }
}
