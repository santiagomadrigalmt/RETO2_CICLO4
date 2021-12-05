package ciclo4.retos2a5.user;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author smadr
 */
@Service
public class UserServices {

    /**
     *
     * @author smadr
     */
    @Autowired
    private UserRepository repository;

    /**
     *
     * @author smadr
     * @return 
     */
    public List<User> getAllUsers() {
        return repository.getAllUsers();
    }

    /**
     *
     * @author smadr
     * @param id
     * @return 
     */
    public Optional<User> getUserById(Integer id) {
        return repository.getUserById(id);
    }

    /**
     *
     * @author smadr
     * @param email
     * @return 
     */
    public Boolean doesUserEmailExist(String email) {
        return repository.getUserByEmail(email).isPresent();
    }

    /**
     *
     * @author smadr
     * @param email
     * @param password
     * @return 
     */
    public User getUserByEmailAndPassword(String email, String password)
    {
        Optional<User> userExists = repository.getUserByEmailAndPassword(email, password);

        if (userExists.isPresent())
        {
            return userExists.get();
        }
        
        return new User();
    }

    /**
     *
     * @author smadr
     * @param user
     * @return 
     */
    public User saveUser(User user)
    {
        Optional<User> userIdMax = repository.lastUserId();
        
        if (user.getId() == null)
        {
            if (userIdMax.isEmpty()) user.setId(1);
            else user.setId( userIdMax.get().getId() + 1 );
        }
        
        Optional<User> userExists = repository.getUserById(user.getId());
        if ( userExists.isEmpty() )
        {
            if ( !doesUserEmailExist(user.getEmail()) )
            {
                return repository.saveUser(user);
            }
            return user;
        }
        return user;        
    }

    /**
     *
     * @author smadr
     * @param user
     * @return
     */
    public User updateUser(User user)
    {
        if (user.getId() != null)
        {
            Optional<User> userExist = repository.getUserById(user.getId());
            
            if (userExist.isPresent())
            {
                if (user.getIdentification() != null) {
                    userExist.get().setIdentification(user.getIdentification());
                }
                if (user.getName() != null) {
                    userExist.get().setName(user.getName());
                }
                if (user.getBirthtDay() != null) {
                    userExist.get().setBirthtDay(user.getBirthtDay());
                }
                if (user.getMonthBirthtDay() != null) {
                    userExist.get().setMonthBirthtDay(user.getMonthBirthtDay());
                }      
                if (user.getAddress() != null) {
                    userExist.get().setAddress(user.getAddress());
                }
                if (user.getCellPhone() != null) {
                    userExist.get().setCellPhone(user.getCellPhone());
                }
                if (user.getEmail() != null) {
                    userExist.get().setEmail(user.getEmail());
                }
                if (user.getPassword() != null) {
                    userExist.get().setPassword(user.getPassword());
                }
                if (user.getZone() != null) {
                    userExist.get().setZone(user.getZone());
                }
                if (user.getType() != null) {
                    userExist.get().setType(user.getType());
                }

                return repository.saveUser(userExist.get());
            } else {
                return user;
            }

        } else {
            return user;
        }
    }

    /**
     *
     * @author smadr
     * @param id
     * @return
     */
    public Boolean deleteUserById(Integer id)
    {
        if ( repository.getUserById(id).isPresent() )
        {
            repository.deleteUserById(id);
            return true;
        }
        return false;
    }

}
