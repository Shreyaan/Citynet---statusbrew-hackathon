#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

//demo

const char* ssid = "Redmi Note 8";       
const char* password = "amritsar";  

const char* serverURL = "https://eoidviykm5r9m7x.m.pipedream.net"; 

int smokeSensorPin = 34;  

void setup() {
  Serial.begin(115200);
  pinMode(smokeSensorPin, INPUT);


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
  Serial.print("Smoke Sensor Value: ");
  Serial.println(sensorValue);


  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Prepare the JSON object
    DynamicJsonDocument jsonDoc(1024);
    jsonDoc["sensor"] = "smoke";
    jsonDoc["value"] = sensorValue;

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

  delay(10000);  
}
