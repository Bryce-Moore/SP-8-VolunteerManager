package API;

import com.sun.net.httpserver.*;

import server.ServerMain;

import java.io.*;
import java.net.*;
import java.nio.charset.*;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class RegHandler implements HttpHandler {

	
	//JSON REQUEST INFORMATION
    private class UserJson { //Request formatting for JSON parsing
        private String email;
        private String password;
        private String first_name;
        private String last_name;
        private String security_question_1;
        private String security_question_2;
        private String phone_number;
    }
    //END JSON REQUEST AREA


	@Override
    public void handle(HttpExchange t) throws IOException {
        InputStreamReader isr = new InputStreamReader(t.getRequestBody(), "utf-8");
       // System.out.println("DEBUGGING RESPONSE");
        //Allow CORS
        Headers headers = t.getResponseHeaders();
        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Authorization");
        headers.add("Access-Control-Max-Age", "3600");

        // Handle OPTIONS method for CORS preflight
        if ("OPTIONS".equals(t.getRequestMethod())) {
            t.sendResponseHeaders(204, -1); // No content response for preflight
            return; // Stop further processing
        }
        
        BufferedReader br = new BufferedReader(isr);
        String line;
        StringBuilder bodyBuilder = new StringBuilder();
        while ((line = br.readLine()) != null) {
            bodyBuilder.append(line);
        }
        
        br.close();
        isr.close();

        String body = bodyBuilder.toString();
        Gson gson = new Gson();
       
        UserJson creds = gson.fromJson(body, UserJson.class);
        
        //Done init
        
        //Logic for the request
        
        //email,pass,first,last,sq1,sq2,phone
        boolean register = ServerMain.d.registerUser(creds.email, creds.password,creds.first_name,creds.last_name,creds.security_question_1,creds.security_question_2,creds.phone_number);
        
        if(register) { //if user was created, sent 200 
	    	//Json for output
	        JsonObject json = new JsonObject();
	        json.addProperty("account_id", ServerMain.d.getUserByEmail(creds.email).getAccountID()); //Return new account ID
	        String response = json.toString();
	        
	        
	        //Send Response
	        t.sendResponseHeaders(200, response.length());
	        OutputStream os = t.getResponseBody();
	        os.write(response.getBytes());
	        os.close();
        }
        else { //if user was created, sent 200 
	    	//Json for output
	        JsonObject json = new JsonObject();
	        json.addProperty("result", "Conflict: User already exists.");
	        String response = json.toString();
	        
	        
	        //Send Response
	        t.sendResponseHeaders(409, response.length());
	        OutputStream os = t.getResponseBody();
	        os.write(response.getBytes());
	        os.close();
        }
        }

    }