package ciclo4.retos2a5.clone;

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
@Document(collection = "clone")
public class Clone
{
    @Id
    private Integer id;
    
    private String brand;
    private String processor;
    private String os;
    private String description;
    private String memory;
    private String hardDrive;
    private Boolean availability = true;
    private Double price;
    private Integer quantity;
    private String photography;
}
