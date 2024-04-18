package API;

import com.sun.net.httpserver.*;

import server.ServerMain;

import java.io.*;
import java.net.*;
import java.nio.charset.*;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class AuthHandler implements HttpHandler {

    private class UserJson { //Request formatting for JSON parsing
        private String email;
        private String password;
    }

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
        
        //Attempt authentication
        String attemptAuth = ServerMain.d.attemptAuthentication(creds.email, creds.password);
        if(attemptAuth != null) {//if auth was successful
            JsonObject json = new JsonObject();
            String accountID=ServerMain.d.getUserByEmail(creds.email).getAccountID();
            json.addProperty("account_id", accountID);
            json.addProperty("auth_token", attemptAuth);
            String response = json.toString();
            ServerMain.d.cache.createSession(accountID, attemptAuth);


            t.sendResponseHeaders(200, response.length());
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
        else { //auth was unsuccessful
	        String response = "401 Unauthorized";
	        t.sendResponseHeaders(401, response.length());
	        OutputStream os = t.getResponseBody();
	        os.write(response.getBytes());
	        os.close();
        }
    }
}