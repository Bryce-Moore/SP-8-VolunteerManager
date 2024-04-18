package server;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Vector;
import java.util.stream.Collectors;

public class DataCache { // Class for handling local versions of data
	Vector<User> users = new Vector<User>();
	Vector<Group> groups = new Vector<Group>();
	Vector<User_Groups> user_groups = new Vector<User_Groups>();
	Vector<Session> sessions = new Vector<Session>();
	Vector<InviteCode> codes = new Vector<InviteCode>();
	Vector<Shift> shifts = new Vector<Shift>();
	
	public DataCache() {
		//users.add(new User("test@test.com","TestABC1234!","Test","test","test","test","678-test")); //Static user for testing
	}
	
	public User getUserByName(String username) {
		for(int i = 0; i < users.size();i++) {
			if(users.get(i).getEmail().equals(username)) {
				return users.get(i);
			}
		}
		return null;
	}
	public Group getGroupByName(String name) {
		for(int i = 0; i < groups.size();i++) {
			if(groups.get(i).getName().equals(name)) {
				return groups.get(i);
			}
		}
		return null;
	}
	public User getUserByID(String ID) {
		for(int i = 0; i < users.size();i++) {
			if(users.get(i).getAccountID().equals(ID)) {
				return users.get(i);
			}
		}
		return null;
	}
	public Shift getShiftByID(String ID) {
		for(int i = 0; i < shifts.size();i++) {
			if(shifts.get(i).getShiftID().equals(ID)) {
				return shifts.get(i);
			}
		}
		return null;
	}
	public Group getGroupByID(String ID) {
		for(int i = 0; i <groups.size();i++) {
			if(groups.get(i).getGroupID().equals(ID)) {
				return groups.get(i);
			}
		}
		return null;
	}
	
	public boolean userExists(String username) {
		for(int i = 0; i < users.size();i++) {
			if(users.get(i).getEmail().equalsIgnoreCase(username)) {
				return true; // return true because user with that email already exists
			}
		}
		return false; //if code is reached, user doesnt exist
	}
	public boolean groupExists(String name) {
		for(int i = 0; i < groups.size();i++) {
			if(groups.get(i).getName().equalsIgnoreCase(name)) {
				return true; // return true because user with that email already exists
			}
		}
		return false; //if code is reached, user doesnt exist
	}
	public boolean createUser(String email, String pass, String first, String last, String sq1, String sq2,String phone){
		if(!userExists(email)) { //if User does not already exist, we can create user
			users.add(new User(email,pass,first,last,sq1,sq2,phone));
			return true;
		}
		return false; //User already exists
		
	}
	/*String date, String startTime, String endTime, String userId, String groupId*/
	public String submitShift(String date, String startTime, String endTime, String userId, String groupId) {
		Shift toAdd=new Shift(date,startTime,endTime,userId,groupId);
		shifts.add(toAdd);
		return toAdd.getShiftID();
	}
	public boolean tokenValid(String auth) {
		for(int i = 0 ; i < sessions.size();i++) {
			if(sessions.get(i).getToken().equals(auth))
				return true;
		}
		return false;
	}

	public boolean createGroup(String name, String description){
		if(!groupExists(name)) { //if group does not already exist, we can create group
			groups.add(new Group(name,description));
			return true;
		}
		return false; //User already exists
		
	}
	public String newInviteCode(String GroupId) {
		InviteCode out = new InviteCode(GroupId);
		codes.add(out);
		return out.getInviteCode();
	}
	public boolean checkAccountID(String ID) {
		for(int i = 0; i < users.size();i++) {
			if(users.get(i).getAccountID().equalsIgnoreCase(ID)) {
				return true; // return true because accountID already exists
			}
		}
		return false; //if code is reached, ID does not exist
	}
	public void createSession(String userId, String token) {
		sessions.add(new Session(userId,token));
	}
	public Session getSessionByToken(String token) {
		for(int i =0; i < sessions.size();i++) {
			if(sessions.get(i).getToken().equals(token))
				return sessions.get(i);
		}
		return null;
	}
	public boolean checkGroupID(String ID) {
		for(int i = 0; i < groups.size();i++) {
			if(groups.get(i).getGroupID().equalsIgnoreCase(ID)) {
				return true; // return true because accountID already exists
			}
		}
		return false; //if code is reached, ID does not exist
	}
	public boolean checkShiftID(String ID) {
		for(int i = 0; i < shifts.size();i++) {
			if(shifts.get(i).getShiftID().equalsIgnoreCase(ID)) {
				return true; // return true because accountID already exists
			}
		}
		return false; //if code is reached, ID does not exist
	}
	public String generateAccountID() {
		String accountID = Util.tokenGeneration(Config.ACCOUNT_ID_SIZE);
		
		while(checkAccountID(accountID)) { //check if ID exists. If it does, keep trying until it doesnt
			accountID = Util.tokenGeneration(Config.ACCOUNT_ID_SIZE);
		}
		
		return accountID;
	}
	public String generateGroupID() {
		String groupID = Util.tokenGeneration(Config.GROUP_ID_SIZE);
		
		while(checkGroupID(groupID)) { //check if ID exists. If it does, keep trying until it doesnt
			groupID = Util.tokenGeneration(Config.GROUP_ID_SIZE);
		}
		
		return groupID;
	}
	public String generateShiftID() {
		String shiftID = Util.tokenGeneration(Config.SHIFT_ID_SIZE);
		
		while(checkShiftID(shiftID)) { //check if ID exists. If it does, keep trying until it doesnt
			shiftID = Util.tokenGeneration(Config.SHIFT_ID_SIZE);
		}
		
		return shiftID;
	}
	public String getRole(String accountID, String groupID) {
		for(int i = 0; i < user_groups.size(); i++) {
			if(user_groups.get(i).getGroupId().equals(groupID) && user_groups.get(i).getUserId().equals(accountID)) {
				return user_groups.get(i).getRole();
			}
		}
		return null;
	}
	public void assignUser(String accountID,String groupID,String role) {
		user_groups.add(new User_Groups(accountID,groupID,role));
	}

	public Vector<Group> getUserGroups(String accountID) {
		Vector <Group> output  = new Vector<Group> ();
		for(int i = 0; i < user_groups.size(); i++) {
			if(user_groups.get(i).getUserId().equals(accountID))
				output.add(getGroupByID(user_groups.get(i).getGroupId()));
		}
		return output;
	}
	public Vector<User> getGroupMembers(String groupID) {
		Vector <User> output  = new Vector<User> ();
		for(int i = 0; i < user_groups.size(); i++) {
			//System.out.println("checking "+user_groups.get(i).getUserId()+" for "+user_groups.get(i).getGroupId());
			if(user_groups.get(i).getGroupId().equals(groupID))
				output.add(getUserByID(user_groups.get(i).getUserId()));
		}
		return output;
	}
	public InviteCode getInviteCode(String code) {
		for(int i = 0; i < codes.size();i++) {
			if(codes.get(i).getInviteCode().equals(code)) {
				return codes.get(i);
			}
		}
		return null;
	}
	public void joinByInvite(String accountID, String invite_code) {
		InviteCode IC = getInviteCode(invite_code);
		assignUser(accountID,IC.getGroupID(),"Default");
	}
	public Vector<Shift> getGroupShifts(String groupID) {
	    Vector<Shift> output = new Vector<Shift>();
	    output = shifts.stream().filter(shift -> shift.getGroupId().equals(groupID)).collect(Collectors.toCollection(Vector::new));
	    output.sort((a, b) -> {
	        int dateComparison = b.getDate().compareTo(a.getDate());
	        if (dateComparison != 0) {
	            return dateComparison;
	        } else {
	            LocalTime startTimeA = LocalTime.parse(a.getStartTime(), DateTimeFormatter.ofPattern("h:mm a"));
	            LocalTime startTimeB = LocalTime.parse(b.getStartTime(), DateTimeFormatter.ofPattern("h:mm a"));
	            return startTimeB.compareTo(startTimeA);
	        }
	    });

	    return output;
	}
	public Vector<Shift> getSingleShifts(String groupID, String userID) {
	    Vector<Shift> output = new Vector<Shift>();
	    output = shifts.stream().filter(shift -> shift.getGroupId().equals(groupID) && shift.getUserId().equals(userID)).collect(Collectors.toCollection(Vector::new));
	    output.sort((a, b) -> {
	        int dateComparison = b.getDate().compareTo(a.getDate());
	        if (dateComparison != 0) {
	            return dateComparison;
	        } else {
	            LocalTime startTimeA = LocalTime.parse(a.getStartTime(), DateTimeFormatter.ofPattern("h:mm a"));
	            LocalTime startTimeB = LocalTime.parse(b.getStartTime(), DateTimeFormatter.ofPattern("h:mm a"));
	            return startTimeB.compareTo(startTimeA);
	        }
	    });

	    return output;
	}
	public boolean isBeforeShift(Shift a, Shift b) {
	    //compare the dates
	    int dateComparison = a.getDate().compareTo(b.getDate());
	    if (dateComparison < 0) {
	        return true;
	    } else if (dateComparison > 0) {
	        return false;
	    } else {
	        //if the dates are equal, compare the times
	        LocalTime startTimeA = LocalTime.parse(a.getStartTime(), DateTimeFormatter.ofPattern("h:mm a"));
	        LocalTime startTimeB = LocalTime.parse(b.getStartTime(), DateTimeFormatter.ofPattern("h:mm a"));
	        return startTimeA.isBefore(startTimeB);
	    }
	}
}
