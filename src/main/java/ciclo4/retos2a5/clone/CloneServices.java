package ciclo4.retos2a5.clone;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author smadr
 */
@Service
public class CloneServices
{
    @Autowired
    public CloneRepository repository;
    
    /**
     *
     * @author smadr
     * @return 
     */
    public List<Clone> getAllClones()
    {
        return repository.getAllClones();
    }    
    
    /**
     *
     * @author smadr
     * @param clone
     * @return 
     */
    public Clone saveClone(Clone clone)
    {
        if (clone.getId() == null)
        {
            return repository.saveClone(clone);
        }
        else
        {
            Optional<Clone> cloneExists = repository.getCloneById(clone.getId());
            if (cloneExists.isPresent())
            {
                return clone;                
            }
            return repository.saveClone(clone);
        }
    }
    
    /**
     *
     * @author smadr
     * @param user
     * @return
     */
    public Clone updateClone(Clone clone)
    {
        if (clone.getId() != null)
        {
            Optional<Clone> cloneExists = repository.getCloneById(clone.getId());
            
            if (cloneExists.isPresent())
            {
                if (clone.getBrand() != null) {
                    cloneExists.get().setBrand(clone.getBrand());
                }
                if (clone.getProcessor() != null) {
                    cloneExists.get().setProcessor(clone.getProcessor());
                }
                if (clone.getOs() != null) {
                    cloneExists.get().setOs(clone.getOs());
                }
                if (clone.getDescription() != null) {
                    cloneExists.get().setDescription(clone.getDescription());
                }                
                if (clone.getMemory() != null) {
                    cloneExists.get().setMemory(clone.getMemory());
                }                
                if (clone.getHardDrive() != null) {
                    cloneExists.get().setHardDrive(clone.getHardDrive());
                }                
                if (clone.getAvailability() != null) {
                    cloneExists.get().setAvailability(clone.getAvailability());
                }                
                if (clone.getPrice() != null) {
                    cloneExists.get().setPrice(clone.getPrice());
                }                
                if (clone.getQuantity() != null) {
                    cloneExists.get().setQuantity(clone.getQuantity());
                }                
                if (clone.getPhotography() != null) {
                    cloneExists.get().setPhotography(clone.getPhotography());
                }                

                return repository.saveClone(cloneExists.get());
            }
            return clone;
        }
        return clone;
    }
    
    public Boolean deleteCloneById(Integer id)
    {
        Optional<Clone> cloneExists = repository.getCloneById(id);

        if (cloneExists.isPresent())
        {
            repository.deleteClone(cloneExists.get());
            return true;
        }

        return false;
    }
    
}
