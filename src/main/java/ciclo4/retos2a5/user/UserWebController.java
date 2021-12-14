package ciclo4.retos2a5.user;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * Class UserWebController
 * @author Santiago M. / Mintic
 */
@RestController
@RequestMapping("/user")
@CrossOrigin( origins = "*", methods= {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE} )
public class UserWebController
{  
    /**
     * Attribute UserServices services
     * @author Santiago M. / Mintic
     */
    @Autowired
    private UserServices services;
    
    // ########## GET REQUESTS ##########
    
    /**
     * GET Method getUsers
     * @author Santiago M. / Mintic
     * @return List of users in the database.
     */
    @GetMapping("/all")
    public List<User> getAllUsers()
    {
        return services.getAllUsers();
    }
    
    /**
     * GET Method getUserById
     * @author Santiago M. / Mintic
     * @param userId
     * @return The user who has the corresponding id.
     */
    @GetMapping("/{userId:^[1-9][0-9]*$}")
    public Optional<User> getUserById(@PathVariable("userId") Integer userId)
    {
        return services.getUserById(userId);
    }
    
    /**
     * GET Method doesUserEmailExist
     * @author Santiago M. / Mintic
     * @param emailToVerify
     * @return TRUE if an user in the database has the provided email. FALSE otherwise.
     */
    @GetMapping("/emailexist/{emailToVerify:^.+@.+\\..+$}")
    public Boolean doesUserEmailExist(@PathVariable("emailToVerify") String emailToVerify)
    {
        return services.doesUserEmailExist(emailToVerify);
    }
    
    /** 
     * GET Method getUserByEmailAndPassword
     * @author Santiago M. / Mintic
     * @param email
     * @param password
     * @return The user with the corresponding email and password, OR a dummy user with all NULL attributes.
     */
    @GetMapping("/{email:^.+@.+\\..+$}/{password:^.{1,50}$}")
    public User getUserByEmailAndPassword( @PathVariable("email") String email, @PathVariable("password") String password )
    {
        return services.getUserByEmailAndPassword(email,password);
    }

    /** 
     * GET Method getUserByEmailAndPassword
     * @author Santiago M. / Mintic
     * @param monthString
     * @return The user with the corresponding email and password, OR a dummy user with all NULL attributes.
     */
    @GetMapping("birthday/{monthString}")
    public List<User> getUsersByBirthdayMonth(@PathVariable("monthString") String monthString)
    {
        return services.getUsersByBirthdayMonth(monthString);
    }
    
    // ########## POST REQUESTS ##########
    
    /**
     * POST Method saveUser
     * @author Santiago M. / Mintic
     * @param user
     * @return Information of the saved user as a User object.
     */
    @PostMapping("/new")
    @ResponseStatus(HttpStatus.CREATED)
    public User saveUser(@RequestBody User user)
    {
        return services.saveUser(user);
    }
    
    
    // ########## PUT REQUESTS ##########
    
    /**
     * PUT Method updateUser
     * @author Santiago M. / Mintic
     * @param user
     * @return Information of the updated user as a User object.
     */
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.CREATED)
    public User updateUser(@RequestBody User user)
    {
        return services.updateUser(user);
    }
    
    
    // ########## DELETE REQUESTS ##########
    
    /**
     * DELETE Method deleteUser
     * @author Santiago M. / Mintic
     * @param userId
     * @return Returns TRUE if the delete was successful. Returns FALSE otherwise.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Boolean deleteUserById(@PathVariable("id") Integer userId)
    {
        return services.deleteUserById(userId);
    }
    
}
