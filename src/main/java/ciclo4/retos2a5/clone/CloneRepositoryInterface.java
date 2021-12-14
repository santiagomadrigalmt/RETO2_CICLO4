package ciclo4.retos2a5.clone;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

/**
 *
 * @author smadr
 */
public interface CloneRepositoryInterface extends MongoRepository<Clone,Integer>
{
    // Functionality 1 RETO_5:
    public List<Clone> findByPrice(Double price);
    
    // Functionality 2 RETO_5:
    public List<Clone> findByDescriptionLike(String chunk);
    
    // Para seleccionar la órden con el ID máximo:
    public Optional<Clone> findTopByOrderByIdDesc();
}
