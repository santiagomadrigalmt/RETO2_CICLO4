package ciclo4.retos2a5.orders;

import ciclo4.retos2a5.clone.Clone;
import ciclo4.retos2a5.user.User;
import java.util.Date;
import java.util.Map;
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
@Document(collection = "orders")
public class Order
{
    public static String PENDING = "Pendiente";
    public static String APROVED = "Aprobada";
    public static String REJECTED = "Rechazada";
    
    @Id
    private Integer id;

    private Date registerDay;
    private String status;
    private User salesMan;
    private Map<Integer, Clone> products;
    private Map<Integer, Integer> quantities; 
}
