package ciclo4.retos2a5.user;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * Class UserRepository
 * @author Santiago M. / Mintic
 */
@Repository
public class UserRepository
{
    /**
     * Attribute UserRepositoryInterface repositoryInterface
     * @author Santiago M. / Mintic
     */
    @Autowired
    private UserRepositoryInterface repositoryInterface;

    /**
    * getAllUsers()
    * @return List of all users
    */
    public List<User> getAllUsers()
    {
        return (List<User>) repositoryInterface.findAll();
    }

    /**
     * saveUser(User user)
     * @param user
     * @return Info about operation
     */
    public User saveUser(User user)
    {
        return repositoryInterface.save(user);
    }

    /**
    * getUserByName(String name)
    * @param name
    * @return User by name
    */ 
    public Optional<User> getUserByName(String name)
    {
        return repositoryInterface.findByName(name);
    }

    /**
    * getUserByEmail(String email)
    * @param email
    * @return User by email
    */
    public Optional<User> getUserByEmail(String email)
    {
        return repositoryInterface.findByEmail(email);
    }

    /**
    * getUsersByNameOrEmail(String name, String email)
    * @param name
    * @param email
    * @return User by name or email
    */
    public List<User> getUsersByNameOrEmail(String name, String email)
    {
        return repositoryInterface.findByNameOrEmail(name, email);
    }

    /**
    * getUserByEmailAndPassword(String email, String password)
    * @param email
    * @param password
    * @return User by email and password
    */
    public Optional<User> getUserByEmailAndPassword(String email, String password)
    {
        return repositoryInterface.findByEmailAndPassword(email, password);
    }
   
    /**
    * getUserById(Integer userId)
    * @param userId
    * @return User by userId
    */
    public Optional<User> getUserById(Integer userId)
    {
        return repositoryInterface.findById(userId);
    }
    
    /**
    * deleteUser(User user)
    * @param user
    * 
    */
    public void deleteUser(User user)
    {
       repositoryInterface.delete(user);
    }
    
    /**
    * deleteUserById(Integer userId)
    * @param userId
    */    
    public void deleteUserById(Integer userId)
    { 
        repositoryInterface.deleteById(userId);
    }

    /**
    * lastUserId()
    * @return 
    */   
    public Optional<User> lastUserId()
    {
        return repositoryInterface.findTopByOrderByIdDesc();
    }
    
    /**
    * deleteUserById(Integer userId)
    * @param monthString
    * @return Users by monthBirthtDay
    */ 
    public List<User> getUsersByBirthdayMonth(String monthString)
    {
        return repositoryInterface.findByMonthBirthtDay(monthString);
    }
    
}