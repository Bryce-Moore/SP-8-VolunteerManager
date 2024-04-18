package API;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import server.ServerMain;
import server.Session;
import server.Shift;

public class ShiftStatus implements HttpHandler {

	
	//JSON REQUEST INFORMATION
    private class UserJson { //Request formatting for JSON parsing
    	
    	/*POST: api/shifts/update-status
This is for an admin to approve or deny submitted shifts.
key:
- shift_id
- status (the value will either be 'Approved' or 'Denied')
- auth_token*/
    	
    	private String shift_id;
    	private String status;
    	private String auth_token;
        
    }
    //END JSON REQUEST AREA


	@Override
    public void handle(HttpExchange t) throws IOException {
        InputStreamReader isr = new InputStreamReader(t.getRequestBody(), "utf-8");

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
        if(ServerMain.d.tokenValid(creds.auth_token)) { //only allow action is user is authorized
        	//Token is valid, identify the session:
        	Session sess = ServerMain.d.cache.getSessionByToken(creds.auth_token);
        //email,pass,first,last,sq1,sq2,phone
        	Shift shift = ServerMain.d.getShiftByID(creds.shift_id);
	        if(shift!=null) { //if user was created, sent 200 
		    	//Json for output
		        JsonObject json = new JsonObject();
		        
		        shift.updateStatus(creds.status);
		        
		        json.addProperty("shift_status", shift.getStatus()); //Return new account ID
				
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
		        json.addProperty("result", "Error submitting shift.");
		        String response = json.toString();
		        
		        
		        //Send Response
		        t.sendResponseHeaders(409, response.length());
		        OutputStream os = t.getResponseBody();
		        os.write(response.getBytes());
		        os.close();
	        }
	        }
        else {
            String response = "Unauthorized access";
            t.sendResponseHeaders(401, response.getBytes(StandardCharsets.UTF_8).length);
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes(StandardCharsets.UTF_8));
            os.close();
            return;
        }
	}

    }