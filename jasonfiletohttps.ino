#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>


#define irSensorPin 27 
#define thermoresistorPin 35
#define smokeSensorPin 34
#define ldrPin 32  
#define currentPin 33 
#define buzzerPin  8
#define ledPin1 5
#define ledPin2 18
#define ledPin3 19
#define ledPin4 21


const float referenceVoltage = 3.3;
const float burdenResistor = 10.0; // Burden resistor value in ohms
const float currentTransformerRatio = 1000.0; // CT ratio (turns ratio of the transformer)
const float sensitivity = 0.1;

const char* ssid = "Statusbrew Guest";       
const char* password = "lifeatstatusbrew";  

const char* serverURL; 
 

void setup() {
  Serial.begin(115200);
 
  pinMode(irSensorPin, INPUT);
  pinMode(buzzerPin, OUTPUT);

  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println(" Connected!");
}

void loop() {
  int currentSensorValue = analogRead(currentPin);
  int smokeSensorValue = analogRead(smokeSensorPin);
  int irSensorValue = digitalRead(irSensorPin); 
  int thermoResistorValue = analogRead(thermoresistorPin);
  int ldrValue = analogRead(ldrPin);

  float ldrVoltage = (ldrValue / 1023.0) * 3.30; // Assuming a 5V reference voltage
  float currentVoltage = (currentSensorValue / 1223.0) * referenceVoltage;
  float current = (currentVoltage * burdenResistor) / (1000*sensitivity * currentTransformerRatio);
  float powerUsage=current*220

  Serial.print("LDR Value: ");
  Serial.print(ldrValue);
  Serial.print("ldrVoltage: ");
  Serial.println(ldrVoltage);
  Serial.print("smokeSensorValue: "); 
  Serial.println(smokeSensorValue);
  Serial.print("irSensorValue: ");
  Serial.println(irSensorValue);
  Serial.print("thermoResistorValue: ");
  Serial.println(thermoResistorValue);
  Serial.print("Current: ");
  Serial.println(current);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Prepare the JSON object
    DynamicJsonDocument jsonDoc(1024);
    serverURL = ;
    if(smokeSensorValue>550){
    serverURL = "https://pleasant-mullet-unified.ngrok-free.app/fire-sensor/fire-detected";
    jsonDoc["sensor_name"] = "smoke";
    jsonDoc["fire_hazard_level"] = 1;
    jsonDoc["smoke_level"] = smokeSensorValue;
    jsonDoc["temp_level"] = thermoResistorValue;
    digitalWrite(buzzerPin, HIGH);
    digitalWrite(ledPin1, LOW);
    }
    if(irSensorValue<1){
    serverURL = "https://pleasant-mullet-unified.ngrok-free.app/fire-sensor/fire-detected";
    jsonDoc["sensor_name"] = "smoke";
    jsonDoc["fire_hazard_level"] = 3;
    jsonDoc["smoke_level"] = smokeSensorValue;
    jsonDoc["temp_level"] = thermoResistorValue;
    digitalWrite(buzzerPin, HIGH);
    digitalWrite(ledPin2, LOW);
    }
    if(thermoResistorValue>1850){
    serverURL = "https://pleasant-mullet-unified.ngrok-free.app/fire-sensor/fire-detected";
    jsonDoc["sensor_name"] = "smoke";
    jsonDoc["fire_hazard_level"] = 2;
    jsonDoc["smoke_level"] = smokeSensorValue;
    jsonDoc["temp_level"] = thermoResistorValue;
    digitalWrite(buzzerPin, HIGH);
    digitalWrite(ledPin3, LOW);
    }
    if(smokeSensorValue<550 && irSensorValue==1 && thermoResistorValue<1850){
    digitalWrite(buzzerPin, LOW);
    digitalWrite(ledPin1, HIGH);
    digitalWrite(ledPin2, HIGH);
    digitalWrite(ledPin3, HIGH);
    }
    if(ldrVoltage<250){
      serverURL = "https://pleasant-mullet-unified.ngrok-free.app/garbage-collection/garbage-overflow";
      jsonDoc["sensor_name"] = "garbage01";
      digitalWrite(ledPin4, HIGH);
    }else if(ldrVoltage>250){
      digitalWrite(ledPin4, LOW); 
    }

    jsonDoc["sensor_name"] = "power01";
    jsonDoc["usage"] = powerUsage;

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

  delay(200);  
}
