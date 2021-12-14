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
     * @param id
     * @return 
     */
    public Optional<Clone> getCloneById(Integer id) {
        return repository.getCloneById(id);
    }
    
    /**
     *
     * @author smadr
     * @param clone
     * @return 
     */
    public Clone saveClone(Clone clone)
    {
        Optional<Clone> cloneIdMax = repository.lastCloneId();
        
        if (clone.getId() == null)
        {
            if (cloneIdMax.isEmpty()) clone.setId(1);
            else clone.setId( cloneIdMax.get().getId() + 1 );
        }
        
        Optional<Clone> cloneExists = repository.getCloneById(clone.getId());
        if ( cloneExists.isEmpty() )
        {
            return repository.saveClone(clone);
        }
        return clone;
    }

    
    /**
     *
     * @author smadr
     * @param clone
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
                if (clone.getProcesor() != null) {
                    cloneExists.get().setProcesor(clone.getProcesor());
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
        if ( repository.getCloneById(id).isPresent() )
        {
            repository.deleteCloneById(id);
            return true;
        }
        return false;
    }
    
    // FUNCTIONALITY 1 - RETO 5:
    public List<Clone> getClonesByPrice(Double price)
    {
        return repository.getClonesByPrice(price);
    }
    
    // Functionality 2 RETO_5:
    public List<Clone> getClonesByDescriptionLike(String chunk)
    {
        return repository.getClonesByDescriptionLike(chunk);
    }
    
    
    
}
