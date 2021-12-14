package ciclo4.retos2a5.user;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 *
 * @author smadr
 */
public interface UserRepositoryInterface extends MongoRepository<User,Integer>
{
    public Optional<User> findByName(String name);   
    public Optional<User> findByEmail(String email);
    public List<User> findByNameOrEmail(String name, String email);
    public Optional<User> findByEmailAndPassword(String email, String password);
    
    // Functionality 3 - RETO 5:
    public List<User> findByMonthBirthtDay(String monthString);
    
    // Para seleccionar el usuario con el ID máximo:
    public Optional<User> findTopByOrderByIdDesc();
}