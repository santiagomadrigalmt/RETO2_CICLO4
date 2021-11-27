package ciclo4.retos2a5.clone;

import ciclo4.retos2a5.user.User;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 *
 * @author smadr
 */
public interface CloneRepositoryInterface extends MongoRepository<Clone,Integer>
{
    
}
