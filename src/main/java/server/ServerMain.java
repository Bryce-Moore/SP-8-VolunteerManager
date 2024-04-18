package server;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;

import com.sun.net.httpserver.HttpServer;

import API.AddToGroup;
import API.AuthHandler;
import API.GenerateInvite;
import API.GetGroup;
import API.GetGroupMembers;
import API.GetGroupShifts;
import API.GetSingleShifts;
import API.GetUser;
import API.GetUserGroups;
import API.JoinInvite;
import API.NewGroup;
import API.NewShift;
import API.RegHandler;
import API.ShiftStatus;
 
public class ServerMain {
	public static DataHandler d = new DataHandler();
	
    public static void main(String[] args) throws Exception {
    	//init Util Log
    	Util.initLogger();
    	
    	 
    	List<Thread> threads = new ArrayList<>();
    	//System.out.println("DEBUG");


    	HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);
        server.createContext("/api/auth/", new AuthHandler());
        server.createContext("/api/auth", new AuthHandler());
        server.createContext("/api/auth/reg", new RegHandler());
        server.createContext("/api/auth/reg/", new RegHandler());
        server.createContext("/api/user/", new GetUser());
        server.createContext("/api/user", new GetUser());
        server.createContext("/api/user/groups", new GetUserGroups());
        server.createContext("/api/user/groups/", new GetUserGroups());
        
        //Group commands
        server.createContext("/api/group/new", new NewGroup());
        server.createContext("/api/group/new/", new NewGroup());
        server.createContext("/api/group/adduser", new AddToGroup());
        server.createContext("/api/group/adduser/", new AddToGroup());
        server.createContext("/api/group", new GetGroup());
        server.createContext("/api/group/", new GetGroup());
        server.createContext("/api/group/members", new GetGroupMembers());
        server.createContext("/api/group/members/", new GetGroupMembers());
        server.createContext("/api/group/invite/", new GenerateInvite());
        server.createContext("/api/group/invite", new GenerateInvite());
        server.createContext("/api/group/join/", new JoinInvite());
        server.createContext("/api/group/join", new JoinInvite());
        server.createContext("/api/shifts/submit/", new NewShift());
        server.createContext("/api/shifts/submit", new NewShift());
        server.createContext("/api/shifts/update-status", new ShiftStatus());
        server.createContext("/api/shifts/update-status/", new ShiftStatus());
        server.createContext("/api/shifts/submissions/", new GetGroupShifts());
        server.createContext("/api/shifts/submissions", new GetGroupShifts());
        server.createContext("/api/shifts/history/", new GetSingleShifts());
        server.createContext("/api/shifts/history", new GetSingleShifts());
        
        server.setExecutor(new ThreadPerTaskExecutor()); // creates a default executor
        Util.log("Server starting");
        server.start();  
}


}