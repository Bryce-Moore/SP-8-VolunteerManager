package API;

import com.sun.net.httpserver.*;

import server.ServerMain;
import server.Session;

import java.io.*;
import java.net.*;
import java.nio.charset.*;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class NewGroup implements HttpHandler {

	
	//JSON REQUEST INFORMATION
    private class UserJson { //Request formatting for JSON parsing
    	
    	private String name;
    	private String description;
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
	        boolean register = ServerMain.d.createGroup(creds.name, creds.description);
	        
	        if(register) { //if user was created, sent 200 
		    	//Json for output
		        JsonObject json = new JsonObject();
		        
		        json.addProperty("group_id", ServerMain.d.getGroupByName(creds.name).getGroupID()); //Return new account ID
				
				
				try {
		        ServerMain.d.assignUser(sess.getUser().getAccountID(), ServerMain.d.getGroupByName(creds.name).getGroupID(), "Admin");
		        
				}
				catch(Exception e) {
					e.printStackTrace();
				}
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
		        json.addProperty("result", "Conflict: Group already exists.");
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