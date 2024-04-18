package API;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Vector;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import server.ServerMain;
import server.Shift;

public class GetGroupShifts implements HttpHandler {
    
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
            
            //Change from groupId to groupId
            String groupId = queryParams.get("group_id");
            if (groupId == null) {
                String response = "Group ID required";
                t.sendResponseHeaders(400, response.getBytes(StandardCharsets.UTF_8).length);
                OutputStream os = t.getResponseBody();
                os.write(response.getBytes(StandardCharsets.UTF_8));
                os.close();
                return;
            }
            
            Vector<Shift> shifts = ServerMain.d.getGroupShifts(groupId);
            if (shifts.isEmpty()) {
                String response = "No shifts found for group.";
                t.sendResponseHeaders(404, response.getBytes(StandardCharsets.UTF_8).length);
                OutputStream os = t.getResponseBody();
                os.write(response.getBytes(StandardCharsets.UTF_8));
                os.close();
                return;
            }
            
            
            /*Shift {
  shift_id: string;
  date: string; // The format in the POST req is YYYY-MM-DD
  startTime: string; // The format in the POST req is HH:MM AM/PM
  endTime: string;
  totalTime: string;
  status: 'Approved' | 'Denied' | 'Pending';
  email: string; // Email address of user who submitted shift. Not necessary in all instances
}*/
            //Construct JSON array from groups
            JsonArray jsonArray = new JsonArray();
            for (Shift shift : shifts) {
                JsonObject jsonObj = new JsonObject();
                jsonObj.addProperty("shift_id", shift.getShiftID());
                jsonObj.addProperty("date", shift.getDate());
                jsonObj.addProperty("start_time", shift.getStartTime());
                jsonObj.addProperty("end_time", shift.getEndTime());
                jsonObj.addProperty("total_time", shift.getTotalTime());
                jsonObj.addProperty("status", shift.getStatus());
                jsonObj.addProperty("account_id", shift.getUserId());
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
