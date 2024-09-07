#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>


#define irSensorPin 27 

#define smokeSensorPin 34


const char* ssid = "Statusbrew Guest";       
const char* password = "lifeatstatusbrew";  

const char* serverURL = "https://pleasant-mullet-unified.ngrok-free.app/fire-sensor/fire-detected"; 
 

void setup() {
  Serial.begin(115200);
 
  pinMode(irSensorPin, INPUT);

  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println(" Connected!");
}

void loop() {

  int sensorValue = analogRead(smokeSensorPin);
  int irsensorValue = digitalRead(irSensorPin); 


  Serial.println(sensorValue);
  Serial.println(irsensorValue); 

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Prepare the JSON object
    DynamicJsonDocument jsonDoc(1024);
    if(sensorValue>450){
    jsonDoc["sensor_name"] = "smoke";
    jsonDoc["fire_hazard_level"] = 1;
    jsonDoc["smoke_level"] = sensorValue;
    }
    if(irsensorValue<1){
    jsonDoc["sensor_name"] = "smoke";
    jsonDoc["fire_hazard_level"] = 2;
    jsonDoc["smoke_level"] = sensorValue;
    jsonDoc["temp_level"] = irsensorValue;
    }

    String jsonData;
    serializeJson(jsonDoc, jsonData);

    http.begin(serverURL); 
    http.addHeader("Content-Type", "application/json");  

    int httpResponseCode = http.POST(jsonData);  

    
    if (httpResponseCode > 0) {
      String response = http.getString();  
      Serial.print("Response code: ");
      Serial.println(httpResponseCode);
      Serial.println("Response: " + response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }

    http.end(); 
  } else {
    Serial.println("Error in WiFi connection");
  }

  delay(15000);  
}
