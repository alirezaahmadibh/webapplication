import java.io.File;
import com.mashape.unirest.http.HttpResponse; // unirest v1.4.9
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
public class MGSamples {
  public static JsonNode sendSimpleMessage() throws UnirestException {
    String apiKey = System.getenv("API_KEY");
        if (apiKey == null) {
            apiKey = "API_KEY";
        }

    HttpResponse<JsonNode> request = Unirest.post("https://api.mailgun.net/v3/sandbox588840f5059c44ab94daa21a83106163.mailgun.org/messages")
      .basicAuth("api", apiKey)
      .queryString("from", "Mailgun Sandbox <postmaster@sandbox588840f5059c44ab94daa21a83106163.mailgun.org>")
      .queryString("to", "Alireza Ahmadi <alirezaeeee@gmail.com>")
      .queryString("subject", "Hello Alireza Ahmadi")
      .queryString("text", "Congratulations Alireza Ahmadi, you just sent an email with Mailgun! You are truly awesome!")
      .asJson();
    return request.getBody();
  }