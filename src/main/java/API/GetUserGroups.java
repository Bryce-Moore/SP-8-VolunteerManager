package API;

import com.sun.net.httpserver.*;
import server.ServerMain;
import server.Group;
import java.io.*;
import java.net.*;
import java.nio.charset.*;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Vector;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

public class GetUserGroups implements HttpHandler {
    
    @Override
    public void handle(HttpExchange t) throws IOException {
        // Determine the request method
        String method = t.getRequestMethod();
        // Allow CORS
        Headers headers = t.getResponseHeaders();
        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Authorization");
        headers.add("Access-Control-Max-Age", "3600");

        // andle OPTIONS method for CORS preflight
        if ("OPTIONS".equals(method)) {
            t.sendResponseHeaders(204, -1); 
            return; 
        }
        if ("GET".equalsIgnoreCase(method)) {
            String query = t.getRequestURI().getQuery();
            Map<String, String> queryParams = parseQuery(query);
            String authToken = queryParams.get("auth_token");
            // Check for authToken and validate it
            boolean validToken = ServerMain.d.tokenValid(authToken);
            
            if (authToken == null || !validToken) {
                String response = "Unauthorized access";
                t.sendResponseHeaders(401, response.getBytes(StandardCharsets.UTF_8).length);
                OutputStream os = t.getResponseBody();
                os.write(response.getBytes(StandardCharsets.UTF_8));
                os.close();
                return;
            }
            
            //Change from groupId to userId
            String userId = queryParams.get("account_id");
            if (userId == null) {
                String response = "Account ID required";
                t.sendResponseHeaders(400, response.getBytes(StandardCharsets.UTF_8).length);
                OutputStream os = t.getResponseBody();
                os.write(response.getBytes(StandardCharsets.UTF_8));
                os.close();
                return;
            }
            
            Vector<Group> groups = ServerMain.d.getUserGroups(userId);
            if (groups.isEmpty()) {
                String response = "No groups found for user";
                t.sendResponseHeaders(404, response.getBytes(StandardCharsets.UTF_8).length);
                OutputStream os = t.getResponseBody();
                os.write(response.getBytes(StandardCharsets.UTF_8));
                os.close();
                return;
            }
            
            //Construct JSON array from groups
            JsonArray jsonArray = new JsonArray();
            for (Group group : groups) {
                JsonObject jsonObj = new JsonObject();
                jsonObj.addProperty("group_id", group.getGroupID());
                jsonObj.addProperty("name", group.getName());
                jsonObj.addProperty("role", ServerMain.d.getRole(userId, group.getGroupID()));
                jsonObj.addProperty("created_at", group.getCreatedAt());
                jsonObj.addProperty("updated_at", group.getUpdatedAt());
                jsonArray.add(jsonObj);
            }
            
            String response = jsonArray.toString();
            
            //Send Response
            t.sendResponseHeaders(200, response.getBytes(StandardCharsets.UTF_8).length);
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes(StandardCharsets.UTF_8));
            os.close();
        } else {
            String response = "HTTP method not supported";
            t.sendResponseHeaders(405, response.getBytes(StandardCharsets.UTF_8).length);
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes(StandardCharsets.UTF_8));
            os.close();
        }
    }
    
    private Map<String, String> parseQuery(String query) {
        Map<String, String> queryPairs = new LinkedHashMap<>();
        if (query != null) {
            String[] pairs = query.split("&");
            for (String pair : pairs) {
                int idx = pair.indexOf("=");
                try {
                    queryPairs.put(URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8.toString()), URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8.toString()));
                } catch (UnsupportedEncodingException e) {
                    // This exception should not occur with the StandardCharsets.UTF_8
                    e.printStackTrace();
                }
            }
        }
        return queryPairs;
    }
}
