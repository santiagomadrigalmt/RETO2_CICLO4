package ciclo4.retos2a5.user;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 *
 * @author smadr
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user")
public class User
{
    @Id
    private Integer id;
   
    private String identification;
    private String name;
    // private Date birthDay;
    // private String monthBirthDay;
    private String address;
    private String cellPhone;
    private String email;
    private String password;
    private String zone;
    private String type;  
}
