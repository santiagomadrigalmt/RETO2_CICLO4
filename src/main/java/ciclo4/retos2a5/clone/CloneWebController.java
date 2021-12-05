package ciclo4.retos2a5.clone;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author smadr
 */
@RestController
@RequestMapping("/clone")
@CrossOrigin( origins = "*", methods= {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE} )
public class CloneWebController
{  
    /**
     * Attribute services
     * @author Santiago M. / Mintic
     */
    @Autowired
    private CloneServices services;
    
    
    // ########## GET REQUESTS ##########
    
    /**
     * GET Method getAllClones
     * @author Santiago M. / Mintic
     * @return List of clones in the database
     */
    @GetMapping("/all")
    public List<Clone> getAllClones()
    {
        return services.getAllClones();
    }
    
    /**
     * GET Method getCloneById
     * @author Santiago M. / Mintic
     * @param cloneId
     * @return The clone with the provided id
     * */
    @GetMapping("/{cloneId:^[1-9][0-9]*$}")
    public Optional<Clone> getCloneById(@PathVariable("cloneId") Integer cloneId)
    {
        return services.getCloneById(cloneId);
    }
    

    // ########## POST REQUESTS ##########
    
    /**
     * POST Method saveClone
     * @author Santiago M. / Mintic
     * @param clone
     * @return 
     */
    @PostMapping("/new")
    @ResponseStatus(HttpStatus.CREATED)
    public Clone saveClone(@RequestBody Clone clone)
    {
        return services.saveClone(clone);
    }


    // ########## PUT REQUESTS ##########
    
    /**
     * PUT Method updateClone
     * @author Santiago M. / Mintic
     * @param clone
     * @return 
     */
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.CREATED)
    public Clone updateClone(@RequestBody Clone clone)
    {
        return services.updateClone(clone);
    }
    
    /**
     * DELETE Method deleteCloneById
     * @author Santiago M. / Mintic
     * @param cloneId
     * @return
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Boolean deleteCloneById(@PathVariable("id") Integer cloneId)
    {
        return services.deleteCloneById(cloneId);
    }
    
}
