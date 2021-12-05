package ciclo4.retos2a5.user;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 *
 * @author smadr
 */
@Repository
public class UserRepository
{

    @Autowired
    private UserRepositoryInterface repositoryInterface;

    /**
    * 
    * @return 
    */
    public List<User> getAllUsers()
    {
        return (List<User>) repositoryInterface.findAll();
    }

    /**
     * 
     * @param user
     * @return 
     */
    public User saveUser(User user)
    {
        return repositoryInterface.save(user);
    }

    /**
    * 
    * @param name
    * @return 
    */ 
    public Optional<User> getUserByName(String name)
    {
        return repositoryInterface.findByName(name);
    }

    /**
    * 
    * @param email
    * @return 
    */
    public Optional<User> getUserByEmail(String email)
    {
        return repositoryInterface.findByEmail(email);
    }

    /**
    * 
    * @param name
    * @param email
    * @return 
    */
    public List<User> getUsersByNameOrEmail(String name, String email)
    {
        return repositoryInterface.findByNameOrEmail(name, email);
    }

    /**
    * 
    * @param email
    * @param password
    * @return 
    */
    public Optional<User> getUserByEmailAndPassword(String email, String password)
    {
        return repositoryInterface.findByEmailAndPassword(email, password);
    }
   
    /**
    * 
    * @param id
    * @return 
    */
    public Optional<User> getUserById(Integer id)
    {
        return repositoryInterface.findById(id);
    }
    
    /**
    * 
    * @param user
    * 
    */
    public void deleteUser(User user)
    {
       repositoryInterface.delete(user);
    }
    
    /**
    * 
    * 
     * @param id
    */    
    public void deleteUserById(Integer id)
    { 
        repositoryInterface.deleteById(id);
    }

    /**
    * 
    * 
     * @return 
    */   
    public Optional<User> lastUserId()
    {
        return repositoryInterface.findTopByOrderByIdDesc();
    }
    
}