package server;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.Random;
import java.util.logging.FileHandler;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

public class Util {
	private static Logger logger = Logger.getLogger("Server Log"); ;
    private static FileHandler fh; 
    public static void initLogger() {
    	   try {  

    	        // This block configure the logger with handler and formatter  
    		   Date date = new Date();
    		    LocalDateTime ldate = LocalDateTime.from(date.toInstant().atZone(ZoneOffset.UTC));
    		    String s = DateTimeFormatter.ISO_DATE_TIME.format(ldate);
    
    	        fh = new FileHandler("logs/latest.log");  
    	        logger.addHandler(fh);
    	        SimpleFormatter formatter = new SimpleFormatter();  
    	        fh.setFormatter(formatter);  

    	        // the following statement is used to log any messages  
    	        logger.info("Logger Initialized");  

    	    } catch (SecurityException e) {  
    	        e.printStackTrace();  
    	    } catch (IOException e) {  
    	        e.printStackTrace();  
    	    }  
    }
    public static boolean stringinArrayList(String toFind, ArrayList<String> toSearch) {
    	for(int i =0; i < toSearch.size();i++) {
    		if(toSearch.get(i).equals(toFind)) {
    			return true;
    		}
    	}
    	return false;
    }
    public static String getHash(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hash);
        } catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException(ex);
        }
    }

    private static String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if(hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
    public static String [] listToArray(ArrayList<String> input) {
    	String [] output = new String[input.size()];
    	for(int i = 0; i < input.size();i++) {
    		output[i]=input.get(i);
    	}
    	return output;
    }
    public static String tokenGeneration(int size) {
    	String charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    	String token="";
    	Random r = new Random();
    	for(int i = 0; i < size; i++) {
    		token+=charSet.charAt(r.nextInt(charSet.length()-1));
    	}
    	return token;
    }
    public static void log(String toLog) {
   // 	System.out.println(toLog);

        logger.info(toLog);  
    }
    public static void logWarning(String toLog) {
   // 	System.out.println(toLog);

        logger.warning(toLog);  
    }
}
