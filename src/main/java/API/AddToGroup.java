package API;

import com.sun.net.httpserver.*;

import server.ServerMain;
import server.Session;

import java.io.*;
import java.net.*;
import java.nio.charset.*;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class AddToGroup implements HttpHandler {

	
	//JSON REQUEST INFORMATION
    private class UserJson { //Request formatting for JSON parsing
    	
    	private String account_id;
    	private String group_id;
       	private String role;
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
        	
        	Session sess = ServerMain.d.cache.getSessionByToken(creds.auth_token);

		    	//Json for output
		        JsonObject json = new JsonObject();
				
				try {
					//System.out.println("USER ID IS: "+creds.account_id);
					ServerMain.d.assignUser(creds.account_id, creds.group_id, creds.role);
		        
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