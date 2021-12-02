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
    // 1. Todos los campos son obligatorios
    // 2. description: No más de 80 caracteres
    // 3. photography: Just an URL
    @Id
    private Integer id;
    
    private String brand;
    // Lo correcto es PROCESSOR,
    // pero toca así para pasar los campos de prueba:
    private String procesor;
    
    private String os;
    private String description;
    private String memory;
    private String hardDrive;
    private Boolean availability = true;
    private Double price;
    private Integer quantity;
    private String photography;
}
