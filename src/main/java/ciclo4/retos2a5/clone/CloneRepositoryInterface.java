package ciclo4.retos2a5.clone;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

/**
 *
 * @author smadr
 */
public interface CloneRepositoryInterface extends MongoRepository<Clone,Integer>
{
    // Para seleccionar la órden con el ID máximo:
    Optional<Clone> findTopByOrderByIdDesc();
}
