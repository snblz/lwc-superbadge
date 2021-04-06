public with sharing class BoatDataService {
    @AuraEnabled(cacheable=true)
    public static List<BoatType__c> getBoatTypes(){
        List<BoatType__c> data = [SELECT Id, Name FROM BoatType__c];
        return data;
    }

    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getBoats(String boatTypeId){
        List<Boat__c> result = null;
        if(boatTypeId.toLowerCase() == 'all'){
            result = [SELECT Id, Name, Boat_Image__c, BoatType__c, Contact__r.Name, Description__c, 
                            Length__c, Picture__c, Price__c, Year_Built__c, BoatType__r.Name 
                    FROM Boat__c];
        }else{
          result  = [SELECT Id, Name, Boat_Image__c, BoatType__c, Contact__r.Name, Description__c, Length__c, Picture__c, Price__c, Year_Built__c, BoatType__r.Name
                    FROM Boat__c
                    WHERE BoatType__c = :boatTypeId];
            
        }
        return result;
    }

    @AuraEnabled(cacheable=true)
    public static String getBoatsByLocation(String boatTypeId, Decimal latitude, Decimal longitude){
        List<Boat__c> boats = [SELECT Name, BoatType__c, Geolocation__latitude__s, Geolocation__longitude__s 
                                FROM Boat__c 
                                WHERE BoatType__c = :boatTypeId
                                ORDER BY DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), 'mi') 
                                LIMIT 10];        
        return JSON.serialize(boats);   
    }

    @AuraEnabled(cacheable=true)
    public static List<Boat__c>  getSimilarBoats(String boatTypeId, String similarBy){
        Boat__c currentBoat = [SELECT Id, BoatType__r.Name, Length__c, Price__c FROM Boat__c WHERE Id = :boatTypeId LIMIT 1];
        List<Boat__c> boatsList = new List<Boat__c>();
        switch on similarBy{
            when 'Type'{
                boatsList = [SELECT Name, Description__c, Price__c, Length__c, BoatType__r.Name, Geolocation__latitude__s, Geolocation__longitude__s 
                            FROM Boat__c 
                            WHERE BoatType__r.Name = :currentBoat.BoatType__r.Name];
            }
            when 'Price'{
                boatsList = [SELECT Name, Description__c, Price__c, Length__c, BoatType__r.Name, Geolocation__latitude__s, Geolocation__longitude__s 
                FROM Boat__c 
                WHERE Price__c = :currentBoat.Price__c];
            }
            when 'Length'{
                boatsList = [SELECT Name, Description__c, Price__c, Length__c, BoatType__r.Name, Geolocation__latitude__s, Geolocation__longitude__s 
                FROM Boat__c 
                WHERE Length__c = :currentBoat.Length__c];
            }
        }
        return boatsList;
    }

    
    @AuraEnabled(cacheable=true)
    public static List<BoatReview__c> getAllReviews(String boatId){
        System.debug('boatId: ' + boatId);
        List<BoatReview__c> boatReviews = [SELECT Name, Comment__c, Rating__c, CreatedBy.Name, CreatedBy.CompanyName, CreatedBy.SmallPhotoUrl  
                                            FROM BoatReview__c
                                            WHERE Boat__c = :boatId];
        return boatReviews;
    }
}