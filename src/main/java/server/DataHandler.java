package server;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Vector;

public class DataHandler {
	public DataCache cache = new DataCache();
	
	public DataHandler()
	{
		
	}
	public User getUserByEmail(String username) {
		//only logic for cache, as we havent implemented the SQL database yet
		return cache.getUserByName(username);
	}
	public Group getGroupByName(String name) {
		//only logic for cache, as we havent implemented the SQL database yet
		return cache.getGroupByName(name);
	}
	public User getUserByID(String username) {
		//only logic for cache, as we havent implemented the SQL database yet
		return cache.getUserByID(username);
	}
	public Group getGroupByID(String username) {
		//only logic for cache, as we havent implemented the SQL database yet
		return cache.getGroupByID(username);
	}
	public Shift getShiftByID(String username) {
		//only logic for cache, as we havent implemented the SQL database yet
		return cache.getShiftByID(username);
	}
	public String submitShift(String date, String startTime, String endTime, String userId, String groupId) {
		return cache.submitShift(date, startTime, endTime, userId, groupId);
	}
	public Vector<Shift> getGroupShifts(String groupID) {
		return cache.getGroupShifts(groupID);
	}
	public Vector<Shift> getSingleShifts(String groupID, String userID) {
		return cache.getSingleShifts(groupID,userID);
	}
	//String email, String pass, String first, String last, String sq1, String sq2,String phone
	public boolean registerUser(String email, String pass, String first, String last, String sq1, String sq2,String phone) {
		//only logic for cache, as we havent implemented the SQL database yet
		return cache.createUser(email,pass,first,last,sq1,sq2,phone);
		
	}
	public Vector <Group> getUserGroups(String accountID){
		return cache.getUserGroups(accountID);
	}
	public String getRole(String accountID, String groupID) {
		return cache.getRole(accountID, groupID);
	}
	public void assignUser(String accountID, String groupID, String role) { //Assign account to role
		cache.assignUser(accountID, groupID, role);
	}
	public boolean createGroup(String name, String description) {
		return cache.createGroup(name, description);
	}
	public boolean tokenValid(String auth) {
		return cache.tokenValid(auth);
	}
	public Vector<User> getGroupMembers(String groupID) {
		return cache.getGroupMembers(groupID);
		
	}
	public String newInviteCode(String GroupId) {
		return cache.newInviteCode(GroupId);
	}
	public String attemptAuthentication(String username, String password) { //if Successful return an authentication token of length 1024
		User toAuth = getUserByEmail(username);
		if(toAuth.getPasshash().equalsIgnoreCase(Util.getHash(password))) {
			//Need to add logic to make sure token isnt already in use (Theres only a 1 in 62^1024 chance, but its still good practice)
			return Util.tokenGeneration(Config.AUTH_TOKEN_SIZE);
		}
		else
			return null;
		
	}
	public void joinByInvite(String accountID, String invite_code) {
		cache.joinByInvite(accountID,invite_code);
		
	}
}